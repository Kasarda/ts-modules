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

    /**
     * 
     * @method send
     * @description Send data to worker or from worker to normal process, filtering by name param
     * @param name -> name of the message
     * @param data -> data to send
     * 
     */
    send(name: string, data: any): WebWorkerInterface



    /**
     * 
     * @method read
     * @description Read data from send method
     * @param name -> name of the sended message
     * @param callback -> callback includes data and event
     * 
     */
    read(name: string, callback: (data?: any, event?: Event) => void): WebWorkerInterface


    /**
     * 
     * @method failed
     * @description Trigger all worker error event
     * @param listener 
     * 
     */
    failed(callback: (event?: Event) => void): WebWorkerInterface


    /**
     * 
     * @method terminate
     * @description Terminate worker
     * Only works with normal process
     * 
     */
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

    failed(listener: (event: Event) => void): WebWorkerInterface{
        this.worker.addEventListener('error', listener)
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

