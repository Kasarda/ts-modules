/**
  *
  * @function item
  * Get specific value from Array by index just like array[index] but this function support negative numbers
  *
*/

function item(arr, index) {
    if (index >= 0) return arr[index]
    return arr[arr.length - Math.abs(index)]
}

module.exports = item