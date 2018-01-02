define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (configuration) {
        if (configuration === void 0) { configuration = {}; }
        var visibility = configuration.visibility, axis = configuration.axis, direction = configuration.direction, target = configuration.target, offset = configuration.offset;
        // Error Handling
        if (!target) {
            console.error('[in-view] -> target property must be an element');
            return;
        }
        // Default values
        visibility = visibility || 'visible';
        axis = axis || 'y';
        direction = direction || 'linear';
        offset = offset || {};
        offset.top = offset.top || 0;
        offset.bottom = offset.bottom || 0;
        offset.right = offset.right || 0;
        offset.left = offset.left || 0;
        // New config with default values
        configuration = {
            visibility: visibility, axis: axis, direction: direction, offset: offset, target: target
        };
        // Error Handling
        if (!/^(visible|entire)$/.test(visibility)) {
            console.error("[in-view] -> visibility take only value: 'visible' or 'entire'");
            return;
        }
        if (!/^(x|y|both)$/.test(axis)) {
            console.error("[in-view] -> axis take only value: 'x', 'y' or 'both'");
            return;
        }
        if (!/^(linear|end|start)$/.test(direction)) {
            console.error("[in-view] -> direction take only value: 'linear', 'end' or 'start'");
            return;
        }
        if (offset.toString() !== '[object Object]') {
            console.error("[in-view] -> offset must be a plain object and can include properties: top, left, bottom, right with number values");
            return;
        }
        // rect data of target and screen
        var _a = target.getBoundingClientRect(), top = _a.top, bottom = _a.bottom, left = _a.left, right = _a.right, width = _a.width, height = _a.height;
        var _b = document.documentElement, clientHeight = _b.clientHeight, clientWidth = _b.clientWidth;
        var innerHeight = window.innerHeight, innerWidth = window.innerWidth;
        // return booleans for visible and entire state of visibility
        var results = {
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
        };
        // Return boolean
        return getResult(configuration, results);
    };
    function getResult(type, results) {
        var visibility = type.visibility, axis = type.axis, direction = type.direction;
        var _a = results[visibility], top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
        if (direction === 'linear') {
            if (axis === 'y')
                return top && bottom;
            else if (axis === 'x')
                return left && right;
            else if (axis === 'both')
                return top && bottom && left && right;
        }
        else if (direction === 'end') {
            if (axis === 'y')
                return bottom;
            else if (axis === 'x')
                return right;
            else if (axis === 'both')
                return bottom && right;
        }
        else if (direction === 'start') {
            if (axis === 'y')
                return top;
            else if (axis === 'x')
                return left;
            else if (axis === 'both')
                return top && left;
        }
    }
});
