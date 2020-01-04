/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

class History {
    constructor(states = []) {
        this._states = states
        this._current = states.length ? Math.max(0, this._lastIndex) : undefined
        this._event = {
            beforepush: [],
            beforechange: [],
            change: [],
            push: [],
            clear: []
        }
    }

    get currentState() {
        return this.states[this.current]
    }

    get states() {
        return Object.assign([], this._states)
    }

    get isLast() {
        return this.current === this._lastIndex
    }

    get isFirst() {
        return this.current === 0
    }

    get current() {
        return this._current
    }

    push(state, pushFromCurrent = true) {

        if (this.states.length)
            this._dispatch('beforepush', { state: this.currentState, index: this.current, action: 'push' })

        if (pushFromCurrent)
            this._states = this._states.filter((_, index) => index <= this.current)
        this._states.push(state)
        this._setCurrent(this._lastIndex, 'push')
        this._dispatch('push', { state, index: this.current, action: 'push' })
        return this.current
    }

    back() {
        if (!this.isFirst && this.states.length)
            this._setCurrent(this.current - 1, 'back')
    }

    forward() {
        if (!this.isLast && this.states.length)
            this._setCurrent(this.current + 1, 'forward')
    }

    to(index) {
        if ((this.current !== index) && this.states.length)
            this._setCurrent(index, 'to')
    }

    get(index) {
        return this._states[index]
    }

    updateState(index, newState) {
        if (index in this._states)
            this._states[index] = newState
    }

    clear() {
        this._dispatch('clear', this._states)
        this._states = []
        this._current = undefined
    }

    addEventListener(eventName, cb) {
        if (eventName === 'change')
            this._event.change.push(cb)

        else if (eventName === 'push')
            this._event.push.push(cb)

        else if (eventName === 'clear')
            this._event.clear.push(cb)

        else if (eventName === 'beforechange')
            this._event.beforechange.push(cb)

        else if (eventName === 'beforepush')
            this._event.beforepush.push(cb)
    }

    removeEventListener(eventName, removeCB) {
        const cbs = this._event[eventName]
        if (cbs instanceof Array)
            this._event[eventName] = this._event[eventName].filter(cb => cb !== removeCB)
    }

    _dispatch(eventName, ...args) {
        const cbs = this._event[eventName]
        if (cbs instanceof Array)
            cbs.forEach(cb => cb.call(this, ...args))
    }

    _setCurrent(index, action) {
        if (action !== 'push' || this.states.length > 1) {
            this._dispatch('beforechange', {
                state: this.currentState,
                index: this.current,
                action
            })
        }

        this._current = Math.min(Math.max(0, index), this._lastIndex)

        this._dispatch('change', {
            state: this.currentState,
            index: this.current,
            action
        })
    }

    get _lastIndex() {
        return this.states.length - 1
    }
}

module.exports = History