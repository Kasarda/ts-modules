/**
  *
  * @function move
  * @param array @type {any[]}
  * @param from @type {number}
  * @param to @type {number}
  * @return @type {array}
  * 
  * -> Move item in array from one position to another
*/
function move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0])
    return array
}

module.exports = move