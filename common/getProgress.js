/**
  *
  * @function getProgress
  * Get progress between 0 and 1 from specific value to specific value
  *
*/

function getProgress(from, to, value, outside = false) {
  const max = to - from
  const user_value = value - from
  const progress = max === 0 ? 0 : user_value / max

  return outside ? progress : Math.max(Math.min(progress, 1), 0)
}

module.exports = getProgress