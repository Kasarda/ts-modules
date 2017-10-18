/**! @license
  * common.ts
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

/**
  *
  * @module common
  * Includes utilities for other modules
  *
 */


/**
  *
  * @function unique
  * Get new unique array from @param array
  *
*/

export function unique(array: any[]): any[] {
    const new_array: any[] = []
    array.forEach(value => {
        if (!new_array.includes(value) && !(value === null || value === undefined))
            new_array.push(value)
    })

    return new_array
}





/**
  *
  * @function isPlain
  * Return true if @param obj is @type {plainObject}
  *
*/

export function isPlain(obj: any): boolean {
    return obj !== null && typeof obj === 'object' && obj.toString() === '[object Object]'
}





/**
  *
  * @function isNaN
  * Return true if @param obj is NaN
  *
*/

export function isNaN(obj: any): boolean {
    if (Number.isNaN)
        return Number.isNaN(obj)
    return typeof obj === 'number' && obj.toString() === 'NaN'
}



/**
  *
  * @function error
  * Throw console error
  *
*/

export function error(this: any, ...msg: any[]): void {
    console.error.apply(this, msg)
}










/**
  *
  * @function rand
  * It is for getting random value
  * {Range}                    -> rand(0, 100)
  * {Random_value}             -> rand(['turkey', 'elephant', 'hen'])
  * {Random_letter}            -> rand('abcdefghijkl')
  * {Random_value_from_object} -> rand( {a: 'some', b: 'value'} )
  *
  * In {Range} the third param is @type {boolean} 
  * if value will be true number will be rounded
  *
*/

export function rand(from: any, to: number = 0, round: boolean = true): any {
    let random: any

    if (typeof from === 'number') {
        random = Math.random() * (to - from) + from
        if (round)
            random = Math.round(random)
    } else if (from.length) {
        const len: number = from.length
        const index: number = Math.round(Math.random() * (len - 1 - 0) + 0)
        random = from[index]
    } else if (from instanceof Object) {
        const arr: any[] = []
        for (const key in from)
            arr.push(key)

        const len: number = arr.length
        const index: number = Math.round(Math.random() * (len - 1 - 0) + 0)
        random = from[arr[index]]
    }

    return random

}



/**
  *
  * @function getProgress
  * Get progress between 0 and 1 from specific value to specific value
  *
*/

export function getProgress(from: number, to: number, value: number, outside?: boolean): number {
    const max: number = to - from
    const user_value: number = value - from
    const progress: number = user_value / max

    return outside ? progress : Math.max(Math.min(progress, 1), 0)
}


/**
  *
  * @function getValue
  * Get value from progress
  *
*/

export function getValue(startWith: number, endWith: number, progress: number, fixed: number = 6): number {
    return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed))
}


/**
  *
  * @function item
  * Get specific value from Array by index just like array[index] but this function supports negative number
  *
*/

export function item(arr: any, index: number): any {
    if (index >= 0) return arr[index]
    return arr[arr.length - Math.abs(index)]
}

/**
  *
  * @function inView
  * Check if element is visible on the screen
  *
*/

export function inView(elem: HTMLElement, offset: number = 0): boolean {
    const rect: ClientRect = elem.getBoundingClientRect()
    const viewHeight: number = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return !(rect.bottom < 0 || rect.top - offset - viewHeight >= 0)
}



/**
  *
  * @function setStyle
  * Set style on element
  * This function handle css prefixs 
  * and @param styles could be @type {plainObject} to set multiple styles
  *
*/


export function setStyles(elem: any, styles: any, value?: any): void {

    function setPrefixIfNeeded(property: string): string {
        const prefixs: string[] = ['webkit', 'moz', 'o', 'ms']

        let style: string = property.replace(/\-.{1}/g, m => m.toUpperCase()).replace(/\-/g, '')

        if (elem.style[style] === undefined) {
            prefixs.forEach(prefix => {
                const prop: string = prefix + style.replace(/^.{1}/, m => m.toUpperCase())
                if (elem.style[prop] !== undefined)
                    style = prop
            })
        }

        return style
    }


    if (typeof styles === 'string')
        elem.style[setPrefixIfNeeded(styles)] = value + ''

    else {
        for (const style in styles)
            elem.style[setPrefixIfNeeded(style)] = styles[style]
    }

}






/**
  *
  * @function createRequestFrame
  * Creating requestAnimationFrame and get progress from duration
  *
*/
export function createRequestFrame(duration: number, callback: (progress?: number, runtime?: number, remaining?: number, runned?: number, timestamp?: number, id?: number) => void | boolean, done?: (id: number) => void): number {
    let starttime: number
    let requestID: number
    function animation(this: any, timestamp: number) {
        const runtime: number = timestamp - starttime
        const progress: number = Math.min(runtime / duration, 1)

        const remaining: number = Math.max(duration - runtime, 0)
        const runned: number = Math.min(runtime, duration)


        let finish = callback.call(this, progress, runtime, remaining, runned, timestamp, requestID)

        if (runtime < duration && finish !== true)
            requestID = requestAnimationFrame((timestamp: number) => animation(timestamp))
        else done && done.call(this, requestID)

    }
    requestID = requestAnimationFrame((timestamp: number) => {
        starttime = timestamp
        animation(timestamp)
    })

    return requestID

}


