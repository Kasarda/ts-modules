/**
  *
  * @function move
  * @param {any[]} array 
  * @param {number} from
  * @param {number} to
  * @return {any[]}
  * 
  * -> Move item in array from one position to another
*/
function move(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0])
  return array
}

module.exports = move