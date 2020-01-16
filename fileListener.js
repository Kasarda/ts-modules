const EventListener = require('./EventEmitter')

export default class FileListener extends EventListener {
    static FILE_IS_NOT_SUPPORTED = Symbol('File is not supported')
    static FILE_IS_TOO_BIG = Symbol('File is too big')

    constructor(config) {
        super()
        const controller = document.createElement('input')
        controller.type = 'file'

        this.config = Object.assign({
            maxSize: 5000000,
            optimizeImage: false,
            supportedFiles: ['image', 'application'],
            controller,
            alert: true,
            drop: null
        }, config)

        this.config.controller.accept = this.config.supportedFiles === '*' ? '*' : this.config.supportedFiles.map(type => `${type}/*`).join(',')
        this.config.controller.addEventListener('change', e => this.processFile(e.target.files[0]))

        if (config.drop) {
            const dropZones = config.drop instanceof Element ? [config.drop] : config.drop
            for (const zone of dropZones) {
                zone.addEventListener('drop', e => {
                    e.preventDefault()
                    let file = null
                    if (e.dataTransfer.items) {
                        const item = e.dataTransfer.items[0]
                        if (item.kind === 'file')
                            file = item.getAsFile()
                    } else {
                        file = e.dataTransfer.files[0]
                    }
                    this.processFile(file, 'drop', zone)
                    this._resetDragClasses()

                }, false)

                zone.addEventListener('dragenter', _ => zone.classList.add('drag-over'), false)
                zone.addEventListener('dragleave', _ => zone.classList.remove('drag-over'), false)
                zone.addEventListener('dragover', e => e.preventDefault(), false)
            }


            let counter = 0
            document.addEventListener('dragenter', e => {
                if (counter++ === 0)
                    dropZones.forEach(zone => zone.classList.add('drag-start'))
            }, false)

            document.addEventListener('dragleave', e => {
                if (--counter === 0)
                    dropZones.forEach(zone => zone.classList.remove('drag-start'))
            }, false)

            document.addEventListener('drop', e => {
                this._resetDragClasses()
                counter = 0
            }, false)
        }
    }

    open() {
        this.config.controller.click()
        return this
    }

    processFile(file, source = 'controller', zone = null) {
        if (file) {
            const event = { source, zone }
            const type = file.type.split('/')[0]
            if (this.config.supportedFiles == '*' || this.config.supportedFiles.includes(type)) {
                if (this.config.optimizeImage && type == 'image') {
                    this.trigger('change', file, URL.createObjectURL(file), type, event)
                }
                else {
                    if (this.config.maxSize >= file.size) {
                        this.trigger('change', file, URL.createObjectURL(file), type, event)
                    }
                    else {
                        this.trigger('error', FileListener.FILE_IS_TOO_BIG, event)
                        this.config.controller.value = null
                    }
                }
            }
            else {
                this.trigger('error', FileListener.FILE_IS_NOT_SUPPORTED, event)
                this.config.controller.value = null
            }
        }
        else {
            this.trigger('empty', event)
        }

        this._resetDragClasses()
        return this
    }

    _resetDragClasses() {
        if (this.config.drop) {
            const zones = this.config.drop instanceof Element ? [this.config.drop] : this.config.drop
            zones.forEach(zone => {
                zone.classList.remove('drag-over')
                zone.classList.remove('drag-start')
            })
        }
    }
}

document.addEventListener('dragover', e => e.preventDefault(), false)
document.addEventListener('drop', e => e.preventDefault(), false)
