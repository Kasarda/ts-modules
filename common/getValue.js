/**
  *
  * @function getValue
  * Get value from progress
  *
*/

function getValue(startWith, endWith, progress, fixed = 6) {
    return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed))
}

module.exports = getValue