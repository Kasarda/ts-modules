/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */



function parseSelector(selector) {
    const attr = {}
    const selectorList = selector.replace(/\[([^\]]+)\]/g, (_, attrString) => {
        const arr = attrString.split(/=/)
        const name = arr[0]
        delete arr[0]
        const value = arr.join('')

        attr[name] = value.replace(/^"|"$/g, '')
        return ''
    }).split(/(\.|#)/)


    const element = selectorList[0] || 'div'
    const params = selectorList.filter((_, key) => key > 0)
    let operators = params.filter((_, key) => !(key % 2))
    let values = params.filter((_, key) => key % 2)

    const classNames = []
    let id

    operators.forEach((item, key) => {
        if (item === '.')
            classNames.push(values[key])
        else if (item === '#' && !id)
            id = values[key]
    })

    return {
        element,
        classNames,
        id,
        attr
    }
}

function toPromise(value, cb) {
    if (value instanceof Promise)
        value.then(val => cb(val))
    else
        cb(value)
}

function createElement(name = '', props = {
    className: null,
    attr: null,
    prop: null,
    data: null,
    style: null,
    child: null,
    text: null,
    html: null,
    src: null,
    on: null,
    appendTo: null,
    prependTo: null,
    ref: null,
    appendFutureChildren: true
}, condition) {


    if (arguments.length >= 3 && !condition)
        return null

    const selector = parseSelector(name)

    if (!('document' in self))
        return {
            selector,
            props,
            condition
        }

    const element = document.createElement(selector.element)

    if (selector.classNames.length)
        element.classList.add(...selector.classNames)

    if (selector.id)
        element.setAttribute('id', selector.id)

    for (const attr in selector.attr)
        element.setAttribute(attr, selector.attr[attr])




    if (typeof props === 'string' || props instanceof Promise) {
        if (element.tagName === 'IMG')
            toPromise(props, val => element.src = val)
        else
            props = { text: props }
    }
    else if (props instanceof Array)
        props = { child: props }
    else if (props instanceof HTMLElement)
        props = { append: props }
    else if (!props) {
        return element
    }

    if (props.className) {
        toPromise(props.className, value => {
            let classes = value

            if (!(value instanceof Array)) {

                if (value.toString() === '[object Object]') {
                    classes = []
                    for (const prop in value) {
                        if (value[prop])
                            classes.push(prop)
                    }
                }
                else
                    classes = [value]
            }

            element.classList.add(...classes)
        })
    }

    if (props.text && !props.html)
        toPromise(props.text, val => element.innerText = val)

    else if (props.html)
        toPromise(props.html, val => element.innerHTML = val)

    if (props.child) {
        if (!(props.child instanceof Array))
            props.child = [props.child]

        function processChild(child) {
            if (['string', 'number'].includes(typeof child))
                return new Text(child)

            if (child instanceof Node)
                return child

            if (child !== null && typeof child === 'object' && 'selector' in child) {
                const elem = createElement(...[child.selector, child.props, child.condition].filter(a => a !== undefined))
                if (elem)
                    return elem
            }

            if (child instanceof Promise)
                return child

            if (child instanceof Array)
                return child.map(c => c).map(c => processChild(c))
        }


        props.child
            .filter(child => child)
            .forEach(child => {
                const children = processChild([child])
                children.forEach(childElem => {
                    if (childElem instanceof Node)
                        element.appendChild(childElem)
                    else if (childElem instanceof Promise) {
                        const placeholder = new Comment('')

                        if (props.appendFutureChildren !== true)
                            element.appendChild(placeholder)


                        childElem.then(value => {
                            const child = processChild(value)

                            if (child instanceof Array)
                                child.forEach(node => {
                                    if (node instanceof Node) {
                                        if (props.appendFutureChildren !== true)
                                            element.insertBefore(node, placeholder)
                                        else
                                            element.appendChild(node)
                                    }
                                })
                            else if (child instanceof Node) {
                                if (props.appendFutureChildren !== true)
                                    element.insertBefore(child, placeholder)
                                else
                                    element.appendChild(child)
                            }
                            placeholder.remove()
                        })
                    }
                })

            })
    }

    if (props.data) {
        for (const data in props.data) {
            const value = props.data[data]
            toPromise(value, val => element.dataset[data] = val)
        }
    }

    if (props.style) {
        for (const style in props.style) {
            let value = props.style[style]
            if (typeof value === 'object' && 'value' in value)
                value = value.value + (value.unit || '')
            toPromise(value, val => element.style[style] = val)
        }
    }

    if (props.attr) {
        for (const attr in props.attr) {
            const value = props.attr[attr]
            toPromise(value, val => element.setAttribute(attr, val))
        }
    }

    if (props.prop) {
        for (const prop in props.prop) {
            const value = props.prop[prop]
            toPromise(value, val => element[prop] = val)
        }
    }

    if (props.src)
        toPromise(props.src, src => element.src = src)

    if (props.on) {
        for (const prop in props.on) {
            const listener = props.on[prop]
            prop.split(', ').forEach(event => element.addEventListener(event, e => listener.call(element, e, element)))
        }
    }

    if (props.appendTo)
        props.appendTo.appendChild(element)

    else if (props.prependTo)
        props.prependTo.insertBefore(element, props.prependTo.firstChild || null)

    if (typeof props.ref === 'function')
        props.ref.call(element, element, props)

    return element
}

createElement.__proto__.parse = function (obj) {
    return createElement(...[obj.selector, obj.props, obj.condition].filter(a => a !== undefined))
}

createElement.__proto__.parseMarkup = function (markup, onlyElements = true) {
    const temp = document.createElement('div')
    temp.innerHTML = markup
    return Array.from(onlyElements ? temp.children : temp.childNodes)
}

module.exports = createElement