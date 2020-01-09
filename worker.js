/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

class WebWorker {
    /**
     * 
     * @param {Worker|Window} worker 
     */
    constructor(worker = self) {
        this.worker = worker === self ? worker : new Worker(worker)
        this.terminated = false
        this.sended = []
        this.readed = []
    }

    /**
     *
     * @param {string} name
     * @param {*} data
     * 
     */
    send(name, ...data) {
        this.worker.postMessage({ name, data })
        this.sended.push(name)
        return this
    }

    /**
     *
     * @param {string} name
     * @param {function(...any):*} callback
     *
     */
    read(name, callback) {
        const scope = this
        this.worker.addEventListener('message', function (event) {
            if (name === event.data.name) {
                this.event = event
                callback.call(this, ...event.data.data)
                scope.readed.push(name)
            }
        })
        return this
    }

    /**
     *
     * @param {function(ErrorEvent):*} listener
     *
     */
    failed(listener) {
        this.worker.addEventListener('error', listener)
        return this
    }

    terminate() {
        if (this.worker.terminate) {
            this.worker.terminate()
            this.terminated = true
        }
        return this
    }
}

module.exports = WebWorker