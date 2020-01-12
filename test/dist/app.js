/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../common/composePath.js":
/*!********************************!*\
  !*** ../common/composePath.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if (!('composedPath' in Event.prototype) || typeof Event.prototype.composedPath !== 'function') {\n    Event.prototype.composedPath = function composedPath() {\n        if (this.path)\n            return this.path;\n        const element = this.target || null;\n        const pathList = [element];\n        if (!element || !element.parentElement)\n            return [];\n        while (element.parentElement) {\n            element = element.parentElement;\n            pathList.unshift(element);\n        }\n        return pathList;\n    };\n}\n\n\n//# sourceURL=webpack:///../common/composePath.js?");

/***/ }),

/***/ "../common/elem.js":
/*!*************************!*\
  !*** ../common/elem.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./composePath */ \"../common/composePath.js\");\nif (!window.__KASARDA_ELEM_STORAGE__)\n    window.__KASARDA_ELEM_STORAGE__ = { events: {}, plugins: {} };\nconst eventStorage = window.__KASARDA_ELEM_STORAGE__.events;\nconst pluginStorage = window.__KASARDA_ELEM_STORAGE__.plugins;\nclass Elem {\n    static plugin(obj) {\n        for (const [key, value] of Object.entries(obj)) {\n            if (key in pluginStorage)\n                throw TypeError(`Plugin with name \"${key}\" already exists`);\n            pluginStorage[key] = value;\n        }\n    }\n    constructor(...selector) {\n        this.target = Array.from(new Set(this.getElementsFromSelector(selector)));\n        for (const [key, value] of Object.entries(pluginStorage)) {\n            if (this[key])\n                throw TypeError(`You can't override protected method \"${key}\"`);\n            this[key] = typeof value === 'function' ? value.call(this, this) : value;\n        }\n    }\n    get first() {\n        return this.target[0];\n    }\n    get last() {\n        return this.target[this.target.length - 1];\n    }\n    get(from, to) {\n        const isFromNum = typeof from === 'number';\n        const isToNum = typeof to === 'number';\n        if (isFromNum && isToNum) {\n            return this.target.filter((_, key) => key >= from && key <= to);\n        }\n        else if (isFromNum && !isToNum) {\n            if (from >= 0)\n                return this.target[from];\n            return this.target[this.target.length - Math.abs(from)];\n        }\n        else if (typeof from === 'function') {\n            return this.target.filter(from);\n        }\n        else {\n            const elements = this.getElementsFromSelector(from);\n            return this.target.filter(target => elements.includes(target));\n        }\n    }\n    prop(name, value) {\n        if (value === undefined)\n            return this.first ? this.first[name] : undefined;\n        this.target.forEach(target => target[name] = value);\n        return this;\n    }\n    data(name, value) {\n        if (value === undefined)\n            return this.first ? this.first.dataset[name] : undefined;\n        this.target.forEach(target => target.dataset[name] = value);\n        return this;\n    }\n    hasData(name) {\n        if (name)\n            return this.first ? name in this.first.dataset : false;\n        else\n            return this.first ? !!Object.keys(this.first.dataset).length : false;\n    }\n    removeData(name) {\n        this.target.forEach(target => delete target.dataset[name]);\n        return this;\n    }\n    addClass(...names) {\n        this.target.forEach(target => target.classList.add(...names));\n        return this;\n    }\n    removeClass(...names) {\n        this.target.forEach(target => target.classList.remove(...names));\n        return this;\n    }\n    hasClass(...names) {\n        let state = true;\n        if (names.length) {\n            names.forEach(name => {\n                if (!this.first.classList.contains(name))\n                    state = false;\n            });\n        }\n        else {\n            return !!this.first.getAttribute('class');\n        }\n        return state;\n    }\n    toggleClass(names, force) {\n        if (!names instanceof Array)\n            names = [names];\n        this.target.forEach(target => {\n            names.forEach(name => target.classList.toggle(name, force));\n        });\n        return this;\n    }\n    render(content) {\n        if (content === undefined) {\n            return this.first ? this.first.innerHTML : undefined;\n        }\n        else {\n            this.target.forEach((target, ...rest) => {\n                target.innerHTML = typeof content === 'function' ? content.call(this, target, ...rest) : content;\n            });\n        }\n        return this;\n    }\n    text(content) {\n        if (content === undefined) {\n            return this.first ? this.first.innerText : undefined;\n        }\n        else {\n            this.target.forEach((target, ...rest) => {\n                target.innerText = typeof content === 'function' ? content.call(this, target, ...rest) : content;\n            });\n        }\n        return this;\n    }\n    insert(content, position = 'end', html = true) {\n        let adjacentPosition = 'beforeend';\n        if (position === 'before')\n            adjacentPosition = 'beforebegin';\n        else if (position === 'begin')\n            adjacentPosition = 'afterbegin';\n        else if (position === 'after')\n            adjacentPosition = 'afterend';\n        if (this.isElem(content)) {\n            const elements = this.getElem(content);\n            elements.forEach(elem => {\n                this.first.insertAdjacentElement(adjacentPosition, elem);\n            });\n        }\n        else if (content) {\n            this.target.forEach(target => {\n                if (html)\n                    target.insertAdjacentHTML(adjacentPosition, content);\n                else\n                    target.insertAdjacentText(adjacentPosition, content);\n            });\n        }\n        return this;\n    }\n    isElem(item) {\n        return item instanceof Element || item instanceof NodeList || item instanceof Array || item instanceof Elem;\n    }\n    getElem(item) {\n        if (this.isElem(item)) {\n            if (item instanceof Element)\n                item = [item];\n            else if (item instanceof Elem)\n                return item = Object.assign([], item.target);\n            else if (item instanceof Array)\n                return item\n                    .map(value => typeof value === 'string' ? Array.from(document.querySelectorAll(value)) : this.getElem(value))\n                    .filter(v => v)\n                    .flat();\n            return Array.from(item);\n        }\n        return undefined;\n    }\n    getElementsFromSelector(selector) {\n        if (this.isElem(selector))\n            return this.getElem(selector);\n        if (typeof selector === 'string')\n            return Array.from(document.querySelectorAll(selector));\n        return [];\n    }\n    add(selector) {\n        return new Elem(this.target.concat(this.getElementsFromSelector(selector)));\n    }\n    filter(selector) {\n        if (typeof selector === 'function')\n            return new Elem(this.target.filter(selector));\n        const elements = this.getElementsFromSelector(selector);\n        return new Elem(this.target.filter(target => elements.includes(target)));\n    }\n    not(selector) {\n        const elements = this.getElementsFromSelector(selector);\n        return new Elem(this.target.filter(target => !elements.includes(target)));\n    }\n    remove() {\n        this.target.forEach(target => target.remove());\n        return this;\n    }\n    has(cssSelector) {\n        return this.first ? !!this.first.querySelector(cssSelector) : false;\n    }\n    find(cssSelector) {\n        const targets = [];\n        this.target.forEach(target => {\n            const children = Array.from(target.querySelectorAll(cssSelector));\n            children.forEach(child => {\n                if (!targets.includes(child))\n                    targets.push(child);\n            });\n        });\n        return new Elem(targets);\n    }\n    on(events, _delegate, _listener, _options) {\n        const listener = typeof _delegate === 'function' ? _delegate : _listener;\n        const options = typeof _listener === 'function' ? _options : _listener;\n        events.split(' ').forEach(eventName => {\n            this.target.forEach(target => {\n                const listenerWrapper = (function (event) {\n                    const delegate = typeof _delegate !== 'function' ? this.getElementsFromSelector(_delegate) : [];\n                    if (delegate.length) {\n                        const path = event.path || event.composePath();\n                        if (delegate.filter(elem => path.includes(elem)).length)\n                            listener.call(this, target, event);\n                    }\n                    else {\n                        listener.call(this, target, event);\n                    }\n                }).bind(this);\n                if (!(target in eventStorage))\n                    eventStorage[target] = {};\n                if (!(eventName in eventStorage[target]))\n                    eventStorage[target][eventName] = [];\n                eventStorage[target][eventName].push({ wrapper: listenerWrapper, origin: listener });\n                target.addEventListener(eventName, listenerWrapper, options);\n            });\n        });\n        return null;\n    }\n    off(events, listener) {\n        if (!events || (typeof events === 'string' && !listener)) {\n            this.target.forEach(target => {\n                if (eventStorage[target]) {\n                    const eventListeners = !events ? eventStorage[target] : {};\n                    if (typeof events === 'string') {\n                        events.split(' ').forEach(eventName => {\n                            eventListeners[eventName] = eventStorage[target][eventName];\n                        });\n                    }\n                    for (const eventName in eventListeners) {\n                        eventStorage[target][eventName].forEach(({ wrapper }) => {\n                            target.removeEventListener(eventName, wrapper);\n                        });\n                        eventStorage[target][eventName] = [];\n                    }\n                }\n            });\n        }\n        else if (typeof events === 'string' && typeof listener === 'function') {\n            this.target.forEach(target => {\n                if (eventStorage[target]) {\n                    events.split(' ').forEach(eventName => {\n                        const listeners = eventStorage[target][eventName];\n                        if (listeners instanceof Array) {\n                            eventStorage[target][eventName] = listeners.filter(({ wrapper, origin }) => {\n                                if (origin === listener) {\n                                    target.removeEventListener(eventName, wrapper);\n                                    return false;\n                                }\n                                return true;\n                            });\n                        }\n                    });\n                }\n            });\n        }\n        else if (typeof events === 'function') {\n            this.target.forEach(target => {\n                if (eventStorage[target]) {\n                    for (const eventName in eventStorage[target]) {\n                        const listeners = eventStorage[target][eventName];\n                        listeners.forEach(({ wrapper, origin }) => {\n                            if (origin === events) {\n                                target.removeEventListener(eventName, wrapper);\n                            }\n                        });\n                    }\n                }\n            });\n        }\n        return this;\n    }\n}\nmodule.exports = Elem;\n\n\n//# sourceURL=webpack:///../common/elem.js?");

/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Elem = __webpack_require__(/*! ../common/elem */ \"../common/elem.js\");\nconst $ = (...s) => new Elem(...s);\nElem.plugin({\n    setColor() {\n        return (color) => {\n            this.target.forEach((target) => {\n                target.style.color = color;\n            });\n        };\n    }\n});\nconst $body = $('body', window);\nconsole.log($body);\n$body.on('click', () => {\n    $body.setColor('red');\n    console.log($body);\n});\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ })

/******/ });