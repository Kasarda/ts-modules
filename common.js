/**! @license
  * common.ts
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
      *
      * @module common
      * Includes utilities for other modules
      *
     */
    /**
      *
      * @function unique
      * Get new unique array from @param array
      *
    */
    function unique(array) {
        var new_array = [];
        array.forEach(function (value) {
            if (!new_array.includes(value) && !(value === null || value === undefined))
                new_array.push(value);
        });
        return new_array;
    }
    exports.unique = unique;
    /**
      *
      * @function isPlain
      * Return true if @param obj is @type {plainObject}
      *
    */
    function isPlain(obj) {
        return obj !== null && typeof obj === 'object' && obj.toString() === '[object Object]';
    }
    exports.isPlain = isPlain;
    /**
      *
      * @function isNaN
      * Return true if @param obj is NaN
      *
    */
    function isNaN(obj) {
        if (Number.isNaN)
            return Number.isNaN(obj);
        return typeof obj === 'number' && obj.toString() === 'NaN';
    }
    exports.isNaN = isNaN;
    /**
      *
      * @function error
      * Throw console error
      *
    */
    function error() {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(this, msg);
    }
    exports.error = error;
    /**
      *
      * @function rand
      * It is for getting random value
      * {Range}                    -> rand(0, 100)
      * {Random_value}             -> rand(['turkey', 'elephant', 'hen'])
      * {Random_letter}            -> rand('abcdefghijkl')
      * {Random_value_from_object} -> rand( {a: 'some', b: 'value'} )
      *
      * In {Range} the third param is @type {boolean}
      * if value will be true number will be rounded
      *
    */
    function rand(from, to, round) {
        if (to === void 0) { to = 0; }
        if (round === void 0) { round = true; }
        var random;
        if (typeof from === 'number') {
            random = Math.random() * (to - from) + from;
            if (round)
                random = Math.round(random);
        }
        else if (from.length) {
            var len = from.length;
            var index = Math.round(Math.random() * (len - 1 - 0) + 0);
            random = from[index];
        }
        else if (from instanceof Object) {
            var arr = [];
            for (var key in from)
                arr.push(key);
            var len = arr.length;
            var index = Math.round(Math.random() * (len - 1 - 0) + 0);
            random = from[arr[index]];
        }
        return random;
    }
    exports.rand = rand;
    /**
      *
      * @function getProgress
      * Get progress between 0 and 1 from specific value to specific value
      *
    */
    function getProgress(from, to, value, outside) {
        var max = to - from;
        var user_value = value - from;
        var progress = user_value / max;
        return outside ? progress : Math.max(Math.min(progress, 1), 0);
    }
    exports.getProgress = getProgress;
    /**
      *
      * @function getValue
      * Get value from progress
      *
    */
    function getValue(startWith, endWith, progress, fixed) {
        if (fixed === void 0) { fixed = 6; }
        return parseFloat((((endWith - startWith) * progress) + startWith).toFixed(fixed));
    }
    exports.getValue = getValue;
    /**
      *
      * @function item
      * Get specific value from Array by index just like array[index] but this function supports negative number
      *
    */
    function item(arr, index) {
        if (index >= 0)
            return arr[index];
        return arr[arr.length - Math.abs(index)];
    }
    exports.item = item;
    /**
      *
      * @function inView
      * Check if element is visible on the screen
      *
    */
    function inView(elem, offset) {
        if (offset === void 0) { offset = 0; }
        var rect = elem.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - offset - viewHeight >= 0);
    }
    exports.inView = inView;
    /**
      *
      * @function setStyle
      * Set style on element
      * This function handle css prefixs
      * and @param styles could be @type {plainObject} to set multiple styles
      *
    */
    function setStyles(elem, styles, value) {
        function setPrefixIfNeeded(property) {
            var prefixs = ['webkit', 'moz', 'o', 'ms'];
            var style = property.replace(/\-.{1}/g, function (m) { return m.toUpperCase(); }).replace(/\-/g, '');
            if (elem.style[style] === undefined) {
                prefixs.forEach(function (prefix) {
                    var prop = prefix + style.replace(/^.{1}/, function (m) { return m.toUpperCase(); });
                    if (elem.style[prop] !== undefined)
                        style = prop;
                });
            }
            return style;
        }
        if (typeof styles === 'string')
            elem.style[setPrefixIfNeeded(styles)] = value + '';
        else {
            for (var style in styles)
                elem.style[setPrefixIfNeeded(style)] = styles[style];
        }
    }
    exports.setStyles = setStyles;
    /**
      *
      * @function createRequestFrame
      * Creating requestAnimationFrame and get progress from duration
      *
    */
    function createRequestFrame(duration, callback, done) {
        var starttime;
        var requestID;
        function animation(timestamp) {
            var runtime = timestamp - starttime;
            var progress = Math.min(runtime / duration, 1);
            var remaining = Math.max(duration - runtime, 0);
            var runned = Math.min(runtime, duration);
            var finish = callback.call(this, progress, runtime, remaining, runned, timestamp, requestID);
            if (runtime < duration && finish !== true)
                requestID = requestAnimationFrame(function (timestamp) { return animation(timestamp); });
            else
                done && done.call(this, requestID);
        }
        requestID = requestAnimationFrame(function (timestamp) {
            starttime = timestamp;
            animation(timestamp);
        });
        return requestID;
    }
    exports.createRequestFrame = createRequestFrame;
});
