/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

export default class EventEmitter {
    _events = {}

    _on(events, cb, name, once = false) {
        const id = Symbol()
        events = events instanceof Array ? events : [events]
        if (once)
            cb.once = true
        cb.listenerName = name === undefined ? id : name

        for (const event of events)
            event in this._events ? this._events[event].push(cb) : this._events[event] = [cb]

        return id
    }

    on(events, cb, name) {
        return this._on(events, cb, name, false)
    }

    once(events, cb, name) {
        return this._on(events, cb, name, true)
    }

    trigger(event, ...data) {
        if (event in this._events) {
            this._events[event].forEach(listener => {
                listener.call(this, ...data)
                if (listener.once)
                    this.off(event, listener)
            })
        }
    }

    off(events, cb) {
        events = events instanceof Array ? events : [events]
        for (const event of events) {
            if (event in this._events) {
                if (cb !== undefined) {
                    this._events[event] = this._events[event].filter(listener => {
                        return typeof cb === 'function' ? listener !== cb : listener.listenerName !== cb
                    })
                }
                else {
                    this._events[event] = []
                }

            }
        }
    }

    offAll(id) {
        for (const event of [...Object.getOwnPropertySymbols(this._events), ...Object.keys(this._events)]) {
            if (id !== undefined) {
                this._events[event] = this._events[event].filter(listener => {
                    return typeof id === 'function' ? listener !== id : listener.listenerName !== id
                })
            }
            else {
                this._events[event] = []
            }
        }
    }
}