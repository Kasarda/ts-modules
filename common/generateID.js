/**
  *
  * @function generateID
  * Generate random string id
  * @return {string}
  *
*/

function generateID() {
    return (Math.random().toString(36) + Date.now().toString(36)).substr(2)
}

module.exports = generateID