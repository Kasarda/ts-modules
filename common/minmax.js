/**
  *
  * @class minmax
  *
*/
function minmax(min, max, value) {
    return Math.min(Math.max(min, value), max)
}

module.exports = minmax