/**
  *
  * @function minmax
  * @param {number} min
  * @param {number} max
  * @param {number} value
  * @return {number}
  *
*/
function minmax(min, max, value) {
  return Math.min(Math.max(min, value), max)
}

module.exports = minmax