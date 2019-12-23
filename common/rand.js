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

function rand(from, to = 0, round = true) {
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


module.exports = rand