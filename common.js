/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */
const rand = require('./common/rand')
const getProgress = require('./common/getProgress')
const getValue = require('./common/getValue')
const item = require('./common/item')
const setStyles = require('./common/setStyles')
const animationLoop = require('./common/animationLoop')
const minmax = require('./common/minmax')
const move = require('./common/move')
const generateID = require('./common/generateID')


module.exports = {
  rand,
  getProgress,
  getValue,
  item,
  setStyles,
  animationLoop,
  minmax,
  move,
  generateID
}