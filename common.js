/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */


/**
  *
  * @function unique
  * Get new unique array from @param array
  *
*/

export function unique(array) {
    const new_array = []
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

export function isPlain(obj) {
    return obj !== null && typeof obj === 'object' && obj.toString() === '[object Object]'
}





/**
  *
  * @function isEqualObject
  * Return true if both objects has same keys with same values
  *
*/

export function isEqualObject(a, b) {
    const left = JSON.parse(JSON.stringify(a))
    const right = JSON.parse(JSON.stringify(b))

    const leftProps = Object.getOwnPropertyNames(left)
    const rightProps = Object.getOwnPropertyNames(right)

    if (leftProps.length != rightProps.length)
        return false

    for (const prop of leftProps) {
        const first = left[prop]
        const second = right[prop]

        if (
            typeof first === 'object' &&
            typeof second === 'object' &&
            first !== null &&
            second !== null
        ) {
            return isEqualObject(first, second)
        }

        if (first !== second)
            return false
    }

    return true
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

export function rand(from, to = 0, round = true) {
    let random

    if (typeof from === 'number') {
        random = Math.random() * (to - from) + from
        if (round)
            random = Math.round(random)
    } else if (from.length) {
        const len = from.length
        const index = Math.round(Math.random() * (len - 1 - 0) + 0)
        random = from[index]
    } else if (from instanceof Object) {
        const arr = []
        for (const key in from)
            arr.push(key)

        const len = arr.length
        const index = Math.round(Math.random() * (len - 1 - 0) + 0)
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

export function getProgress(from, to, value, outside = false) {
    const max = to - from
    const user_value = value - from
    const progress = user_value / max

    return outside ? progress : Math.max(Math.min(progress, 1), 0)
}


/**
  *
  * @function getValue
  * Get value from progress
  *
*/

export function getValue(startWith, endWith, progress, fixed = 6) {
    return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed))
}


/**
  *
  * @function item
  * Get specific value from Array by index just like array[index] but this function support negative numbers
  *
*/

export function item(arr, index) {
    if (index >= 0) return arr[index]
    return arr[arr.length - Math.abs(index)]
}




/**
  *
  * @function setStyle
  * Set style on element
  * This function handle css prefixs
  * and @param styles could be @type {plainObject} to set multiple styles
  *
*/


export function setStyles(elem, styles, value) {

    function setPrefixIfNeeded(property) {
        const prefixs = ['webkit', 'moz', 'o', 'ms']

        let style = property.replace(/\-.{1}/g, m => m.toUpperCase()).replace(/\-/g, '')

        if (elem.style[style] === undefined) {
            prefixs.forEach(prefix => {
                const prop = prefix + style.replace(/^.{1}/, m => m.toUpperCase())
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
export function createRequestFrame(duration, callback, done) {
    let starttime
    let requestID
    function animation(timestamp) {
        const runtime = timestamp - starttime
        const progress = Math.min(runtime / duration, 1)

        const remaining = Math.max(duration - runtime, 0)
        const runned = Math.min(runtime, duration)


        let finish = callback.call(this, progress, runtime, remaining, runned, timestamp, requestID)

        if (runtime < duration && finish !== true)
            requestID = requestAnimationFrame((timestamp) => animation(timestamp))
        else done && done.call(this, requestID)

    }
    requestID = requestAnimationFrame((timestamp) => {
        starttime = timestamp
        animation(timestamp)
    })

    return requestID

}