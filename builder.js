/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */
const EventEmitter = require('./EventEmitter')


class Part {
    constructor(builder, PartClass, override) {
        this.builder = builder
        this.id = builder.generateID()
        this._instance = new PartClass(this, builder)
        if (override)
            this._instance.data = override
        this._instance.data.id = this.id
        this._data = this._instance.data
        this._PartClass = PartClass
    }

    getData() {
        return Object.assign({}, this._data)
    }

    remove() {
        this.builder._parts = this.builder._parts
            .filter(part => part !== this)
        this.builder.trigger('remove', this)
    }

    clone(origin = {
        after: this
    }) {
        const data = this.getData()
        newPart = this.builder.push(this._PartClass, origin, data)
        this.builder.trigger('clone', this, newPart)
    }

    update(prop, value) {
        if (prop in this._data && prop !== 'id') {
            this._data[prop] = value
            this.builder.trigger('update', this._data, prop, value)
            return value
        }
        throw new TypeError(`Can't update property "${prop}" because it not exists or property is private id`)
    }

    move(origin) {
        const from = this.builder.getPos(this)
        let to = this.builder._parts.length
        if (origin) {
            if (origin.after || origin.before)
                to = this.builder.getPos(origin.after || origin.before)
            else if (origin.first)
                to = 0
            else if (origin.pos)
                to = origin.pos
        }
        this.builder._move(this.builder._parts, from, to)
        this.builder.trigger('move', this, from, to)
    }
}

class Builder extends EventEmitter {
    constructor(data) {
        super()
        this._global = data
        this._parts = []
        this.id = this.generateID()
        this.plugin = {}
    }

    addPlugin(name, PluginClass) {
        this.plugin[name] = new PluginClass(this)
    }

    push(PartClass, origin, refactor = {}) {
        const part = new Part(this, PartClass)
        part._data = Object.assign(part.getData(), refactor || {})
        this._addFromOrigin(part, origin)
        this.trigger('push', part)
        return part
    }

    _addFromOrigin(data, origin) {
        if (origin) {
            if (origin.before) {
                const part = this.get(origin.before)
                const pos = this.getPos(part)
                return this._parts.splice(pos, 0, data)
            }
            if (origin.after) {
                const part = this.get(origin.after)
                const pos = this.getPos(part)
                return this._parts.splice(pos ? pos + 1 : 0, 0, data)
            }
            if (origin.pos) {
                return this._parts.splice(origin.pos, 0, data)
            }
            if (origin.first) {
                return this._parts.unshift(data)
            }
        }
        return this._parts.push(data)
    }

    get(part) {
        const id = this.getID(part)
        return this._parts.find(part => part.id === id)
    }

    getID(part) {
        if (typeof part === 'number')
            return this._parts[part].id

        return part instanceof Part ? part.id : part
    }

    getPos(part) {
        const id = this.getID(part)
        let pos = this._parts.length ? this._parts.length - 1 : 0
        this._parts.find((part, index) => {
            if (part.id === id)
                pos = index
        })
        return pos
    }

    generateID() {
        return (Math.random().toString(36) + Date.now().toString(36)).substr(2)
    }

    update(prop, value) {
        if (prop in this._global) {
            this._global[prop] = value
            this.trigger('global_update', this._global, prop, value)
            return value
        }

        throw new TypeError(`Can't update property "${prop}" on global data because it not exists`)
    }

    getGlobalData() {
        return this._global
    }

    getParts() {
        return this._parts
    }

    getData() {
        return {
            id: this.id,
            parts: this.getParts(),
            global: this.getGlobalData()
        }
    }


    toFormData(extraData) {
        const data = this.getData()
        const id = data.id

        const form = new FormData()

        if (extraData) {
            for (const [prop, value] of Object.entries(extraData))
                form.append(prop, value)
        }

        const parts = []
        data.parts.forEach(part => {
            const partData = this._appendFile(part.getData(), form)
            parts.push(partData)
        })
        const global = this._appendFile(data.global, form)
        form.append('builder', JSON.stringify({ id, parts, global }))
        return form
    }

    _appendFile(data, form) {
        for (const [prop, value] of Object.entries(data)) {
            if (value instanceof File) {
                const fileID = this.generateID()
                form.append(fileID, value)
                data[prop] = fileID
            }
        }
        return data
    }

    _move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0])
        return array
    }

    init(dataObject) {
        const data = typeof dataObject === 'string' ? JSON.parse(dataObject) : dataObject
        this.id = data.id
        this._global = data.global
        this._parts = data.parts
            .map(part => new Part(this, Builder.UnknownPart, part))
        this.trigger('init', data)
    }

    static UnknownPart = class {
        data = {}
    }
}

module.exports = Builder