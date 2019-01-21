/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2018-Present, Filip Kasarda
  *
  */

/**
* Interaction is tiny library for handling mouse and touch event with unique event object which is same for touch and mouse events.
 
• Handles mousedown + touchstart, mouseup + touchend, mousemove + touchmove and click event
• Swap and drag event
• Block mouse events on touch screens
• Special utilities functions for getting coords for element or finding if element is inside another element or if element is touching other element etc.
 
 
API: 
  interaction = new Interaction(Options)
  
  Options = {
    target?: object|element = window,
    passive?: boolean = true,
    button?: number|[number] = 0,
    start?: Function(EventObject),
    end?: Function(EventObject),
    move?: Function(EventObject),
    click?: Function(EventObject),
    swap?: Function(SpecialEventObject),
    drag?: Function(SpecialEventObject),
  }
  
  EventObject = {
    original: object,
    type: string,
    target: element,
    path: [element],
    timeStamp: number,
    detail: number,
    button: number,
    buttons: number,
    altKey: boolean,
    ctrlKey: boolean,
    shiftKey: boolean,
    metaKey: boolean,
    isTouch: boolean,
    isMouse: boolean,
    screenX: number,
    screenY: number,
    clientX: number,
    clientY: number,
    pageX: number,
    pageY: number,
    offsetX: number,
    offsetY: number,
    radiusX: number || null,
    radiusY: number || null,
    force: number,
    rotationAngle: number,
    touches: [TouchEventObject],
    
    preventDefault: Function,
    stopPropagation: Function,
    stopImmediatePropagation: Function,
    getCenterCoords: Function(container = target.offsetParent),
    getDistanceBetweenElements: Function(first: element, second: element),
    isTargetInContainer: Function(container = target.offsetParent),
    isTargetTouchingContainer: Function(container = target.offsetParent),
  }
  
  SpecialEventObject = {
    start: EventObject,
    move: EventObject,
    end: EventObject,
    target: element,
    path: [element],
    time,
    isTouch: boolean,
    isMouse: boolean,
    distanceX: number,
    distanceY: number,
    diagonal: number,
    width: number,
    height: number,
    x1: number,
    x2: number
    y1: number,
    y2: number,
    
    preventDefault: Function,
    stopPropagation: Function,
    stopImmediatePropagation: Function,
    getCenterCoords: Function(container = target.offsetParent),
    getDistanceBetweenElements: Function(first: element, second: element),
    isTargetInContainer: Function(container = target.offsetParent),
    isTargetTouchingContainer: Function(container = target.offsetParent),
    getRelativeTargetCoords: Function(container = target.offsetParent),
    getTargetCoords: Function
  }
  
  
  interaction.state -> empty object for adding some data to use later
  interaction.getCenterCoords: Function(target, container, [x, y]),
  interaction.getDistanceBetweenElements: Function(first, second),
  interaction.isTargetInContainer: Function(target, container),
  interaction.isTargetTouchingContainer: Function(target, container),
  interaction.getRelativeTargetCoords: Function(target, container, distanceX, distanceY),
  interaction.getTargetCoords: Function(targetOffsetX, targetOffsetY, distanceX, distanceY)
*/


export default class Interaction {
    constructor({
        target = window,
        button = 0,
        passive = true,
        move,
        start,
        end,
        swap,
        drag,
        click
    }) {
        this._target = target
        this._event = {
            move,
            start,
            end,
            swap,
            drag,
            click
        }

        this.state = {}
        this._button = [].concat(button)

        this._isTouchStart = false
        this._isTouchEnd = false
        this._isTouchMove = false
        this._dragStart = false
        this._startEvent = {}
        this._startTargetOffsetX = null
        this._startTargetOffsetY = null


        this._target.addEventListener('mousemove', event => this._move(event), { passive })
        this._target.addEventListener('touchmove', event => this._move(event), { passive })

        this._target.addEventListener('mousedown', event => this._start(event), { passive })
        this._target.addEventListener('touchstart', event => this._start(event), { passive })

        this._target.addEventListener('mouseup', event => this._end(event), { passive })
        this._target.addEventListener('touchend', event => this._end(event), { passive })

        this._target.addEventListener('click', event => this._click(event), { passive })

    }

    _move(event) {
        let moveEvent
        if (event.type === 'touchmove') {
            this._isTouchMove = true
            moveEvent = this._touchHandler(event)
        }
        else if (!this._isTouchMove && this._button.includes(event.button)) {
            moveEvent = this._mouseHandler(event)
        }

        if (event.type === 'touchmove' || !this._isTouchMove && this._button.includes(event.button)) {
            this._trigger(this._event.move, moveEvent)
            if (this._dragStart) {
                const dragEvent = this._dragHandler(moveEvent)
                this._trigger(this._event.drag, dragEvent)
            }
        }

        if (event.type === 'mousemove')
            this._isTouchMove = false
    }

    _start(event) {
        let startEvent
        if (event.type === 'touchstart') {
            this._isTouchStart = true
            this._isTouchMove = true
            this._isTouchEnd = true
            startEvent = this._touchHandler(event)
        }
        else if (!this._isTouchStart && this._button.includes(event.button)) {
            startEvent = this._mouseHandler(event)
        }

        if (event.type === 'touchstart' || !this._isTouchStart && this._button.includes(event.button)) {
            this._trigger(this._event.start, startEvent)
            this._startEvent = startEvent
            this._startTargetOffsetX = startEvent.target.offsetLeft
            this._startTargetOffsetY = startEvent.target.offsetTop

            this._dragStart = true
        }


        if (event.type === 'mousedown')
            this._isTouchStart = false

        this.data = event.type
    }

    _end(event) {
        let endEvent
        if (event.type === 'touchend') {
            this._isTouchEnd = true
            endEvent = this._touchHandler(event)
        }
        else if (!this._isTouchEnd && this._button.includes(event.button)) {
            endEvent = this._mouseHandler(event)
        }

        if (event.type === 'touchend' || !this._isTouchEnd && this._button.includes(event.button)) {
            this._trigger(this._event.end, endEvent)

            const swapEvent = this._swapHandler(endEvent)
            this._trigger(this._event.swap, swapEvent)

            this._dragStart = false
        }

        if (event.type === 'mouseup')
            this._isTouchEnd = false
    }

    _click(event) {
        const clickEvent = this._mouseHandler(event)
        this._trigger(this._event.click, clickEvent)
    }

    _mouseHandler(event) {
        const {
            screenX, screenY,
            clientX, clientY,
            offsetX, offsetY,
            pageX, pageY,
            type, detail, timeStamp,
            ctrlKey, shiftKey, altKey, metaKey, target,
            path
        } = event

        return Object.setPrototypeOf({
            original: event,
            type, target, timeStamp, detail, path,
            ctrlKey, shiftKey, altKey, metaKey,
            isTouch: false,
            isMouse: true,
            screenX, screenY,
            clientX, clientY,
            offsetX, offsetY,
            pageX, pageY,
            radiusX: null, radiusY: null, force: 1, rotationAngle: 0,
            touches: []
        }, this._prototype(event))
    }

    _touchHandler(event) {
        const {
            type, target, timeStamp,
            ctrlKey, shiftKey, altKey, metaKey,
            path, detail
        } = event

        const touches = []
        for (const touch of event.changedTouches) {
            const {
                screenX, screenY,
                clientX, clientY,
                pageX, pageY,
                target,
                radiusX, radiusY, force, rotationAngle
            } = touch

            touches.push({
                screenX, screenY,
                clientX, clientY,
                offsetX: pageX - target.offsetLeft,
                offsetY: pageY - target.offsetTop,
                pageX, pageY,
                target,
                radiusX, radiusY, force, rotationAngle
            })
        }

        return Object.setPrototypeOf({
            original: event,
            type, target, timeStamp, detail, path,
            button: 0, buttons: 0,
            ctrlKey, shiftKey, altKey, metaKey,
            isTouch: true,
            isMouse: false,
            ...touches[0],
            touches
        }, this._prototype(event))
    }

    _swapHandler(event) {
        const x1 = event.clientX
        const x2 = this._startEvent.clientX
        const y1 = event.clientY
        const y2 = this._startEvent.clientY

        const height = Math.abs(y1 - y2)
        const width = Math.abs(x1 - x2)
        const diagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2))

        const distanceX = x1 - x2
        const distanceY = y1 - y2

        const time = event.timeStamp - this._startEvent.timeStamp

        return Object.setPrototypeOf({
            start: this._startEvent,
            end: event,
            distanceX,
            distanceY,
            diagonal,
            height,
            width,
            x1, x2, y1, y2,
            time,
            target: this._startEvent.target,
            path: this._startEvent.path,
            isTouch: this._startEvent.isTouch,
            isMouse: this._startEvent.isMouse
        }, this._specialPrototype(event))
    }

    _dragHandler(event) {
        const x1 = event.clientX
        const x2 = this._startEvent.clientX
        const y1 = event.clientY
        const y2 = this._startEvent.clientY

        const height = Math.abs(y1 - y2)
        const width = Math.abs(x1 - x2)
        const diagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2))

        const distanceX = x1 - x2
        const distanceY = y1 - y2

        const time = event.timeStamp - this._startEvent.timeStamp

        return Object.setPrototypeOf({
            start: this._startEvent,
            move: event,
            distanceX,
            distanceY,
            diagonal,
            height,
            width,
            x1, x2, y1, y2,
            time,
            target: this._startEvent.target,
            path: this._startEvent.path,
            isTouch: this._startEvent.isTouch,
            isMouse: this._startEvent.isMouse
        }, this._specialPrototype(event, distanceX, distanceY, this._startEvent.target))
    }



    _prototype(event, targetElem) {
        const clientX = 'clientX' in event ? event.clientX : event.changedTouches[0].clientX
        const clientY = 'clientY' in event ? event.clientY : event.changedTouches[0].clientY
        const target = targetElem ? targetElem : event.target

        return {
            getCenterCoords: (container = target.offsetParent) => this.getCenterCoords(target, container, [clientX, clientY]),
            isTargetInContainer: (container = target.offsetParent) => this.isTargetInContainer(target, container),
            isTargetTouchingContainer: (container = target.offsetParent) => this.isTargetTouchingContainer(target, container),
            getDistanceBetweenElements: this.getDistanceBetweenElements,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
            stopImmediatePropagation: () => event.stopImmediatePropagation()
        }
    }

    _specialPrototype(event, distanceX, distanceY, target) {
        return {
            ...this._prototype(event, target),
            getRelativeTargetCoords: (container = target.offsetParent) => this.getRelativeTargetCoords(target, container, distanceX, distanceY),
            getTargetCoords: () => this.getTargetCoords(this._startTargetOffsetX, this._startTargetOffsetY, distanceX, distanceY)
        }
    }


    getRelativeTargetCoords(target, container, distanceX, distanceY) {
        const targetRect = target.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const parentRect = target.offsetParent.getBoundingClientRect()

        const minX = -parentRect.left + containerRect.left
        const minY = -parentRect.top + containerRect.top

        const maxX = (containerRect.width - targetRect.width) + minX
        const maxY = (containerRect.height - targetRect.height) + minY

        const x = distanceX + this._startTargetOffsetX
        const y = distanceY + this._startTargetOffsetY

        return [
            this.minmax(minX, maxX, x),
            this.minmax(minY, maxY, y)
        ]
    }

    getTargetCoords(offsetX, offsetY, distanceX, distanceY) {
        return [
            distanceX + offsetX,
            distanceY + offsetY
        ]
    }

    getCenterCoords(target, container, [x, y]) {
        const containerRect = container.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const parentRect = target.offsetParent.getBoundingClientRect()

        const coordX = x - parentRect.left - (targetRect.width / 2)
        const coordY = y - parentRect.top - (targetRect.height / 2)

        const minX = -parentRect.left + containerRect.left
        const minY = -parentRect.top + containerRect.top

        const maxX = (containerRect.width - targetRect.width) + minX
        const maxY = (containerRect.height - targetRect.height) + minY

        return [
            this.minmax(minX, maxX, coordX),
            this.minmax(minY, maxY, coordY)
        ]
    }

    isTargetInContainer(target, container) {
        const containerRect = container.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        const x2 = containerRect.left + containerRect.width
        const y2 = containerRect.top + containerRect.height

        if (
            (targetRect.left >= containerRect.left && targetRect.left + targetRect.width <= x2) &&
            (targetRect.top >= containerRect.top && targetRect.top + targetRect.height <= y2)
        ) {
            return true
        }

        return false
    }

    isTargetTouchingContainer(target, container) {
        const containerRect = container.getBoundingClientRect()
        const elemRect = target.getBoundingClientRect()

        const x2 = containerRect.left + containerRect.width
        const y2 = containerRect.top + containerRect.height

        if (
            (elemRect.left > (containerRect.left - elemRect.width) && elemRect.left < x2) &&
            (elemRect.top > (containerRect.top - elemRect.height) && elemRect.top < y2)
        ) {
            return true
        }

        return false
    }

    getDistanceBetweenElements(first, second) {
        const firstRect = first.getBoundingClientRect()
        const secondRect = second.getBoundingClientRect()

        return [
            Math.abs(firstRect.left - secondRect.left),
            Math.abs(firstRect.top - secondRect.top)
        ]
    }

    minmax(min, max, value) {
        return Math.max(Math.min(value, max), min)
    }

    _trigger(cb, ...data) {
        if (typeof cb === 'function')
            cb.call(this, ...data)
    }
}