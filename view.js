/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */


export default (configuration = {}) => {
    let { visibility, axis, direction, target, offset } = configuration


    // Error Handling
    if (!target) {
        console.error('[in-view] -> target property must be an element')
        return
    }


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
    if (!/^(visible|entire)$/.test(visibility)) {
        console.error(`[in-view] -> visibility take only value: 'visible' or 'entire'`)
        return
    }

    if (!/^(x|y|both)$/.test(axis)) {
        console.error(`[in-view] -> axis take only value: 'x', 'y' or 'both'`)
        return
    }

    if (!/^(linear|end|start)$/.test(direction)) {
        console.error(`[in-view] -> direction take only value: 'linear', 'end' or 'start'`)
        return
    }

    if (offset.toString() !== '[object Object]') {
        console.error(`[in-view] -> offset must be a plain object and can include properties: top, left, bottom, right with number values`)
        return
    }



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