/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */


function View(configuration = {}) {
    let { visibility, axis, direction, target, offset } = configuration


    // Error Handling
    if (!target)
        throw new TypeError('[in-view] -> target property must be an element')

    if (target.offsetParent === null)
        return false


    // Default values
    visibility = visibility || 'visible'
    axis = axis || 'y'
    direction = direction || 'linear'
    offset = offset || {}

    offset.top = offset.top || 0
    offset.bottom = offset.bottom || 0
    offset.right = offset.right || 0
    offset.left = offset.left || 0

    // New config with default values
    configuration = {
        visibility, axis, direction, offset, target
    }


    // Error Handling
    if (!/^(visible|entire)$/.test(visibility))
        throw new TypeError(`[in-view] -> visibility take only value: 'visible' or 'entire'`)

    if (!/^(x|y|both)$/.test(axis))
        throw new TypeError(`[in-view] -> axis take only value: 'x', 'y' or 'both'`)

    if (!/^(linear|end|start)$/.test(direction))
        throw new TypeError(`[in-view] -> direction take only value: 'linear', 'end' or 'start'`)

    if (offset.toString() !== '[object Object]')
        throw new TypeError(`[in-view] -> offset must be a plain object and can include properties: top, left, bottom, right with number values`)



    // rect data of target and screen
    const { top, bottom, left, right, width, height } = target.getBoundingClientRect()
    const { clientHeight, clientWidth } = document.documentElement
    const { innerHeight, innerWidth } = window



    // return booleans for visible and entire state of visibility
    const results = {
        visible: {
            top: top + height - offset.top >= 0,
            left: left + width - offset.left >= 0,
            bottom: bottom - height - offset.bottom <= (innerHeight || clientHeight),
            right: right - width - offset.right <= (innerWidth || clientWidth)
        },

        entire: {
            top: top - offset.top >= 0,
            left: left - offset.left >= 0,
            bottom: bottom - offset.bottom <= (innerHeight || clientHeight),
            right: right - offset.right <= (innerWidth || clientWidth)
        }
    }

    // Return boolean
    return getResult(configuration, results)

}




function getResult(type, results) {
    const { visibility, axis, direction } = type
    const { top, left, bottom, right } = results[visibility]

    if (direction === 'linear') {
        if (axis === 'y')
            return top && bottom

        else if (axis === 'x')
            return left && right

        else if (axis === 'both')
            return top && bottom && left && right
    }
    else if (direction === 'end') {
        if (axis === 'y')
            return bottom

        else if (axis === 'x')
            return right

        else if (axis === 'both')
            return bottom && right
    }
    else if (direction === 'start') {
        if (axis === 'y')
            return top

        else if (axis === 'x')
            return left

        else if (axis === 'both')
            return top && left
    }
}

module.exports = View