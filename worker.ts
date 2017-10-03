/**
 * 
 * @module worker
 * 
 * Includes easy functionality for comunication between browser and web worker
 * Work just fine in browser and web worker js interface
 * 
 */

export interface WebWorkerInterface {
    worker: any
    terminated: boolean
    sended: string[]
    readed: string[]
    send(name: string, data: any): WebWorkerInterface
    read(name: string, callback: (data?: any, event?: Event) => void): WebWorkerInterface
    failed(callback: (event?: Event) => void): WebWorkerInterface
    terminate(): WebWorkerInterface
}


export class WebWorker implements WebWorkerInterface  {
    worker: any
    terminated: boolean = false
    sended: string[] = []
    readed: string[] = []
    
    constructor(worker: any = self){
        this.worker = worker === self ? worker : new worker
    }

    send(name: string, data: any): WebWorkerInterface{
        this.worker.postMessage({name, data})
        this.sended.push(name)
        return this
    }

    read(name: string, callback: (data?: any, event?: Event) => void): WebWorkerInterface{
        const scope: WebWorkerInterface = this
        this.worker.addEventListener('message', function(event){
            if(name === event.data.name){
                callback.call(this, event.data.data, event)
                scope.readed.push(name)
            }
    })
        return this
    }
    failed(callback: (event: Event) => void): WebWorkerInterface{
        this.worker.addEventListener('error', function(event) {
            callback.call(this, event)
        })
        return this
    }
    terminate(): WebWorkerInterface{
        if(this.worker.terminate){
            this.worker.terminate()
            this.terminated = true
        }
        return this
    }
}

