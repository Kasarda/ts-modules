/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2018-Present, Filip Kasarda
  *
  */

/*
The library is for creating custom slide shows.


API:
 
new SlideShow(options:Options)
 
Options = {
  targets:HTMLElement||NodeList||selector||Array[selector||HTMLElement],
  start:number = 1,
  activeClass:string = 'active',
  interval:number?,
  slide:Function(pos:number)?,
  next:Function(pos:number)?,
  prev:Function(pos:number)?
}
 
slide.next(stopAtTheEnd:boolean=false)
slide.prev(continueFromStart:boolean=false)
slide.to(pos:number)
slide.stopInterval()
slide.startInterval(duration:number)
slide.add(target:selector||HTMLElement, pos:number)
slide.remove(pos:number)
slide.override(targets:HTMLElement||NodeList||selector||Array[selector||HTMLElement])
 
slide.current -> number -> current position of the slide
slide.interval -> number -> current duration of the interval
slide.targets  -> Array[HTMLElement]
slide.start  -> number
*/

class SlideShow {
    constructor({
        targets,
        start = 1,
        activeClass = 'active',
        interval,
        slide,
        next,
        prev
    }) {
        this._targets = this._elem(targets)
        this._start = start < 1 ? 1 : start > this._targets.length ? this._targets.length : start
        this._current = this._start
        this._activeClass = activeClass
        this._interval = interval
        this._intervalID = null
        this._event = {
            slide,
            next,
            prev,
            _manual_action: null
        }

        this._to(this._current)
        this.startInterval(this._interval)
    }

    get current() {
        return this._current
    }

    get start() {
        return this._start
    }

    get interval() {
        return this._interval
    }

    get targets() {
        return this._targets
    }


    add(selector, pos) {
        const elem = this._elem(selector)
        if (pos)
            this._targets.splice(pos - 1, 0, ...elem)
        else
            this._targets = this._targets.concat(elem)

        if (this._current === pos)
            this.to(pos)
    }

    remove(pos) {
        if (this._current === pos)
            this._targets.forEach(target => target.classList.remove(this._activeClass))

        this._targets.splice(pos - 1, 1)

        if (this._current === pos)
            this.prev()
    }

    override(targets) {
        const elems = this._elem(targets)

        if (elems) {
            this._targets.forEach(target => target.classList.remove(this._activeClass))
            this._targets = elems
            this.to(1)
        }
    }

    next(stopAtTheEnd = false) {
        return this._next(stopAtTheEnd, true)
    }

    prev(continueFromEnd = false) {
        return this._prev(continueFromEnd, true)
    }

    to(pos) {
        return this._to(pos, true)
    }

    startInterval(duration) {
        if (typeof duration === 'number') {
            this._interval = duration
            this.stopInterval()

            if (duration > 0)
                this._intervalID = setInterval(_ => this._next(), duration)
        }

        this._event._manual_action = _ => {
            if (this._intervalID)
                this.startInterval(duration)
        }
    }

    stopInterval() {
        clearInterval(this._intervalID)
        this._intervalID = null
    }

    _next(stopAtTheEnd = false, action) {
        const current = this._current
        const len = this._targets.length
        const next = current === len ? (stopAtTheEnd ? len : 1) : current + 1

        if (this._isInRange(next)) {
            this._trigger(this._event.next, next)
            this._to(next, action)
        }
    }

    _prev(continueFromEnd = false, action) {
        const current = this._current
        const len = this._targets.length
        const prev = current === 1 ? (continueFromEnd ? len : 1) : current - 1

        if (this._isInRange(prev)) {
            this._trigger(this._event.prev, prev)
            this._to(prev, action)
        }
    }

    _to(pos, action = false) {
        if (this._isInRange(pos)) {
            this._targets.forEach((target, index) => {
                target.classList.remove(this._activeClass)
                if (index + 1 === pos) {
                    target.classList.add(this._activeClass)
                    this._current = pos
                }
            })
            if (action)
                this._trigger(this._event._manual_action)
            this._trigger(this._event.slide, pos)
        }
        else {
            if (this._targets.length)
                console.error('Position is out of range')
            else {
                this._current = null
                this.stopInterval()
            }
        }
    }

    _trigger(cb, ...data) {
        if (typeof cb === 'function')
            cb.call(this, ...data)
    }

    _isInRange(pos) {
        return pos >= 1 && pos <= this._targets.length
    }

    _elem(selector) {
        if (selector instanceof HTMLElement)
            return [selector]

        else if (selector instanceof NodeList)
            return Array.from(selector)

        else if (selector instanceof Array)
            return selector.map(elem => {
                if (typeof elem === 'string')
                    return document.querySelector(elem)
                return elem
            })

        else if (typeof selector === 'string')
            return Array.from(document.querySelectorAll(selector))

        console.error('Invalid type of the targets. Only selector, HTMLElement, NodeList and Array of elements or selectors are allowed ')
        return false
    }
}

module.exports = SlideShow