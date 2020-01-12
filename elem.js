
require('./polyfill/composePath')

if (!window.__KASARDA_ELEM_STORAGE__)
    window.__KASARDA_ELEM_STORAGE__ = { events: {}, plugins: {} }

const eventStorage = window.__KASARDA_ELEM_STORAGE__.events
const pluginStorage = window.__KASARDA_ELEM_STORAGE__.plugins

class Elem {
    static plugin(obj) {
        for (const [key, value] of Object.entries(obj)) {
            if (key in pluginStorage)
                throw TypeError(`Plugin with name "${key}" already exists`)
            pluginStorage[key] = value
        }
    }

    constructor(...selector) {
        this.target = Array.from(new Set(this.getElementsFromSelector(selector)))

        for (const [key, value] of Object.entries(pluginStorage)) {
            if (this[key])
                throw TypeError(`You can't override protected method "${key}"`)
            this[key] = typeof value === 'function' ? value.call(this, this) : value
        }
    }

    get first() {
        return this.target[0]
    }

    get last() {
        return this.target[this.target.length - 1]
    }

    get(from, to) {
        const isFromNum = typeof from === 'number'
        const isToNum = typeof to === 'number'

        if (isFromNum && isToNum) {
            return this.target.filter((_, key) => key >= from && key <= to)
        }
        else if (isFromNum && !isToNum) {
            if (from >= 0)
                return this.target[from]
            return this.target[this.target.length - Math.abs(from)]
        }
        else if (typeof from === 'function') {
            return this.target.filter(from)
        }
        else {
            const elements = this.getElementsFromSelector(from)
            return this.target.filter(target => elements.includes(target))
        }
    }

    prop(name, value) {
        if (value === undefined)
            return this.first ? this.first[name] : undefined
        this.target.forEach(target => target[name] = value)
        return this
    }

    data(name, value) {
        if (value === undefined)
            return this.first ? this.first.dataset[name] : undefined
        this.target.forEach(target => target.dataset[name] = value)
        return this
    }

    hasData(name) {
        if (name)
            return this.first ? name in this.first.dataset : false
        else
            return this.first ? !!Object.keys(this.first.dataset).length : false
    }

    removeData(name) {
        this.target.forEach(target => delete target.dataset[name])
        return this
    }

    addClass(...names) {
        this.target.forEach(target => target.classList.add(...names))
        return this
    }

    removeClass(...names) {
        this.target.forEach(target => target.classList.remove(...names))
        return this
    }

    hasClass(...names) {
        let state = true
        if (names.length) {
            names.forEach(name => {
                if (!this.first.classList.contains(name))
                    state = false
            })
        }
        else {
            return !!this.first.getAttribute('class')
        }

        return state
    }

    toggleClass(names, force) {
        if (!names instanceof Array)
            names = [names]

        this.target.forEach(target => {
            names.forEach(name => target.classList.toggle(name, force))
        })
        return this
    }

    render(content) {
        if (content === undefined) {
            return this.first ? this.first.innerHTML : undefined
        }
        else {
            this.target.forEach((target, ...rest) => {
                target.innerHTML = typeof content === 'function' ? content.call(this, target, ...rest) : content
            })
        }

        return this
    }

    text(content) {
        if (content === undefined) {
            return this.first ? this.first.innerText : undefined
        }
        else {
            this.target.forEach((target, ...rest) => {
                target.innerText = typeof content === 'function' ? content.call(this, target, ...rest) : content
            })
        }

        return this
    }

    insert(content, position = 'end', html = true) {
        let adjacentPosition = 'beforeend'
        if (position === 'before')
            adjacentPosition = 'beforebegin'
        else if (position === 'begin')
            adjacentPosition = 'afterbegin'
        else if (position === 'after')
            adjacentPosition = 'afterend'

        if (this.isElem(content)) {
            const elements = this.getElem(content)
            elements.forEach(elem => {
                this.first.insertAdjacentElement(adjacentPosition, elem)
            })
        }
        else if (content) {
            this.target.forEach(target => {
                if (html)
                    target.insertAdjacentHTML(adjacentPosition, content)
                else
                    target.insertAdjacentText(adjacentPosition, content)
            })
        }

        return this
    }

    isElem(item) {
        return item instanceof Element || item instanceof NodeList || item instanceof Array || item instanceof Elem
    }

    getElem(item) {
        if (this.isElem(item)) {
            if (item instanceof Element)
                item = [item]
            else if (item instanceof Elem)
                return item = Object.assign([], item.target)
            else if (item instanceof Array)
                return item
                    .map(value => typeof value === 'string' ? Array.from(document.querySelectorAll(value)) : this.getElem(value))
                    .filter(v => v)
                    .flat()
            return Array.from(item)
        }
        return undefined
    }

    getElementsFromSelector(selector) {

        if (this.isElem(selector))
            return this.getElem(selector)
        if (typeof selector === 'string')
            return Array.from(document.querySelectorAll(selector))
        return []
    }

    add(selector) {
        return new Elem(this.target.concat(this.getElementsFromSelector(selector)))
    }

    filter(selector) {
        if (typeof selector === 'function')
            return new Elem(this.target.filter(selector))

        const elements = this.getElementsFromSelector(selector)
        return new Elem(this.target.filter(target => elements.includes(target)))
    }

    not(selector) {
        const elements = this.getElementsFromSelector(selector)
        return new Elem(this.target.filter(target => !elements.includes(target)))
    }

    remove() {
        this.target.forEach(target => target.remove())
        return this
    }

    has(cssSelector) {
        return this.first ? !!this.first.querySelector(cssSelector) : false
    }

    find(cssSelector) {
        const targets = []

        this.target.forEach(target => {
            const children = Array.from(target.querySelectorAll(cssSelector))
            children.forEach(child => {
                if (!targets.includes(child))
                    targets.push(child)
            })

        })
        return new Elem(targets)
    }

    on(events, _delegate, _listener, _options) {
        const listener = typeof _delegate === 'function' ? _delegate : _listener
        const options = typeof _listener === 'function' ? _options : _listener

        events.split(' ').forEach(eventName => {
            this.target.forEach(target => {
                const listenerWrapper = (function (event) {
                    const delegate = typeof _delegate !== 'function' ? this.getElementsFromSelector(_delegate) : []
                    if (delegate.length) {
                        const path = event.path || event.composePath()
                        if (delegate.filter(elem => path.includes(elem)).length)
                            listener.call(this, target, event)
                    }
                    else {
                        listener.call(this, target, event)
                    }
                }).bind(this)
                if (!(target in eventStorage))
                    eventStorage[target] = {}

                if (!(eventName in eventStorage[target]))
                    eventStorage[target][eventName] = []

                eventStorage[target][eventName].push({ wrapper: listenerWrapper, origin: listener })
                target.addEventListener(eventName, listenerWrapper, options)
            })
        })

        return null
    }

    off(events, listener) {
        if (!events || (typeof events === 'string' && !listener)) {
            this.target.forEach(target => {
                if (eventStorage[target]) {

                    const eventListeners = !events ? eventStorage[target] : {}

                    if (typeof events === 'string') {
                        events.split(' ').forEach(eventName => {
                            eventListeners[eventName] = eventStorage[target][eventName]
                        })
                    }

                    for (const eventName in eventListeners) {
                        eventStorage[target][eventName].forEach(({ wrapper }) => {
                            target.removeEventListener(eventName, wrapper)
                        })
                        eventStorage[target][eventName] = []
                    }
                }
            })
        }

        else if (typeof events === 'string' && typeof listener === 'function') {
            this.target.forEach(target => {
                if (eventStorage[target]) {
                    events.split(' ').forEach(eventName => {
                        const listeners = eventStorage[target][eventName]
                        if (listeners instanceof Array) {
                            eventStorage[target][eventName] = listeners.filter(({ wrapper, origin }) => {
                                if (origin === listener) {
                                    target.removeEventListener(eventName, wrapper)
                                    return false
                                }
                                return true
                            })
                        }
                    })
                }
            })
        }
        else if (typeof events === 'function') {
            this.target.forEach(target => {
                if (eventStorage[target]) {
                    for (const eventName in eventStorage[target]) {
                        const listeners = eventStorage[target][eventName]
                        listeners.forEach(({ wrapper, origin }) => {
                            if (origin === events) {
                                target.removeEventListener(eventName, wrapper)
                            }
                        })
                    }
                }
            })
        }

        return this
    }
}


module.exports = Elem


// next
// prev


// elem.insert('hello', 'after', true)


// elem('selector').prop('a', 10)
// elem('selector').data('a', 10)
// elem('selector').removeData('a')
// elem('selector').hasData('a')

// elem('selector').addClass('a')
// elem('selector').removeClass('a', 10)
// elem('selector').toggleClass('a', 10)
// elem('selector').hasClass('a', 10)

// elem('selector').html('selector')
// elem('selector').text('selector')

// elem('selector').on('click mousedown', 'div', _ => {})
// elem('selector').once('click mousedown', 'div', _ => {})
// elem('selector').off('click mousedown')
// elem('selector').trigger()



// elem('selector').remove()
// elem('selector').add()
// elem('selector').has()
// elem('selector').find('selector')


// elem('selector').parent(selector)
// elem('selector').parents()
// elem('selector').offsetParent()

// elem('selector').rect()
// elem('selector').toggle()
// elem('selector').show()
// elem('selector').hide()
// elem('selector').style({})
// elem('selector').scroll({})