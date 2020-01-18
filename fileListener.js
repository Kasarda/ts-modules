const EventEmitter = require('./EventEmitter')

class FileListener extends EventEmitter {
    static FILE_IS_NOT_SUPPORTED = Symbol('File is not supported')
    static FILE_IS_TOO_BIG = Symbol('File is too big')

    constructor(config = {}) {
        super()
        const controller = document.createElement('input')
        controller.type = 'file'

        this.config = Object.assign({
            size: Infinity,
            accept: null,
            controller,
            multiple: false,
            drop: null,
            dropClassNames: {
                start: 'drag-start',
                over: 'drag-over'
            }
        }, config)
        this.accept = this._createAcceptString(this.config.accept)
        this.config.controller.accept = this.accept
        this.config.controller.multiple = !!this.config.multiple

        this.config.controller.addEventListener('change', e => {
            if (e.target.files.length) {
                Array
                    .from(e.target.files)
                    .forEach(file => this._processFile(file, e))
            }
            else {
                this._processFile(null, e)
            }

        })

        this._drop()
    }

    open() {
        this.config.controller.click()
        return this
    }

    matchesMime(mime, accept) {
        const fileType = mime.split('/')[0]
        return !!accept
            .replace(/ /g, '')
            .split(',')
            .filter(type => {
                if (/(\/\*)$/.test(type) && fileType === type.replace(/(\/\*)$/, ''))
                    return true
                return type === mime
            }).length
    }

    _drop() {
        if (this.config.drop) {
            const dropZones = this.config.drop instanceof Element ? [this.config.drop] : this.config.drop
            for (const zone of dropZones) {
                zone.addEventListener('drop', e => {
                    e.preventDefault()
                    const files = []

                    if (e.dataTransfer.items) {
                        if (this.config.multiple) {
                            Array
                                .from(e.dataTransfer.items)
                                .forEach(item => {
                                    if (item.kind === 'file')
                                        files.push(item.getAsFile())
                                })
                        }
                        else {
                            files.push(e.dataTransfer.items[0].getAsFile())
                        }


                    } else {
                        if (this.config.multiple)
                            files.concat(Array.from(e.dataTransfer.files))
                        else
                            files.push(e.dataTransfer.files[0])
                    }

                    if (files.length)
                        files.forEach(file => this._processFile(file, e, 'drop', zone))
                    else
                        this._processFile(null, e, 'drop', zone)

                    this._resetDragClasses()

                }, false)

                zone.addEventListener('dragenter', _ => zone.classList.add(this.config.dropClassNames.over), false)
                zone.addEventListener('dragleave', _ => zone.classList.remove(this.config.dropClassNames.over), false)
                zone.addEventListener('dragover', e => e.preventDefault(), false)
            }

            let counter = 0
            document.addEventListener('dragenter', _ => {
                if (counter++ === 0)
                    dropZones.forEach(zone => zone.classList.add(this.config.dropClassNames.start))
            }, false)

            document.addEventListener('dragleave', _ => {
                if (--counter === 0)
                    dropZones.forEach(zone => zone.classList.remove(this.config.dropClassNames.start))
            }, false)

            document.addEventListener('drop', _ => {
                this._resetDragClasses()
                counter = 0
            }, false)
        }
    }

    _createAcceptString(accept) {
        if (accept instanceof Array) {
            return accept.map(mime => {
                if (!mime.includes('/'))
                    return mime + '/*'
                return mime
            }).join(',').replace(/ /g, '')
        }
        else if (typeof accept === 'string')
            return accept
        return '*'
    }

    _processFile(file, originalEvent, source = 'controller', zone = null) {
        const event = { file, source, zone, originalEvent, toURL: () => URL.createObjectURL(file) }
        if (file) {
            if (this.config.accept == '*' || this.matchesMime(file.type, this.accept)) {
                if (this.config.size >= file.size) {
                    this.trigger('change', { ...event, empty: false })
                }
                else {
                    this.trigger('error', { ...event, message: 'File is too big', error: FileListener.FILE_IS_TOO_BIG, code: 1 })
                    this.config.controller.value = null
                }
            }
            else {
                this.trigger('error', { ...event, message: 'File is not supported', error: FileListener.FILE_IS_NOT_SUPPORTED, code: 2 })
                this.config.controller.value = null
            }
        }
        else {
            this.trigger('change', { ...event, empty: true })
        }

        this._resetDragClasses()
        return this
    }

    _resetDragClasses() {
        if (this.config.drop) {
            const zones = this.config.drop instanceof Element ? [this.config.drop] : this.config.drop
            zones.forEach(zone => {
                zone.classList.remove(this.config.dropClassNames.over)
                zone.classList.remove(this.config.dropClassNames.start)
            })
        }
    }
}

document.addEventListener('dragover', e => e.preventDefault(), false)
document.addEventListener('drop', e => e.preventDefault(), false)

module.exports = FileListener