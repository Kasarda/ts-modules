/**
  *
  * @function getValue
  * Get value from progress
  * @param {number} startWith
  * @param {number} endWith
  * @param {number} progress
  * @param {number} fixed
  * @returns {number}
  *
*/

function getValue(startWith, endWith, progress, fixed = 6) {
  return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed))
}

module.exports = getValue