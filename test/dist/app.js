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

/***/ "../EventEmitter.js":
/*!**************************!*\
  !*** ../EventEmitter.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**! @license\n  *\n  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the\n  * LICENSE file in the root directory of this source tree.\n  *\n  * Copyright (c) 2017-Present, Filip Kasarda\n  *\n  */\nclass EventEmitter {\n    constructor() {\n        this._events = {};\n    }\n    _on(events, cb, name, once = false) {\n        const id = Symbol();\n        events = events instanceof Array ? events : [events];\n        if (once)\n            cb.once = true;\n        cb.listenerName = name === undefined ? id : name;\n        for (const event of events)\n            event in this._events ? this._events[event].push(cb) : this._events[event] = [cb];\n        return id;\n    }\n    on(events, cb, name) {\n        return this._on(events, cb, name, false);\n    }\n    once(events, cb, name) {\n        return this._on(events, cb, name, true);\n    }\n    trigger(event, ...data) {\n        if (event in this._events) {\n            this._events[event].forEach(listener => {\n                listener.call(this, ...data);\n                if (listener.once)\n                    this.off(event, listener);\n            });\n        }\n    }\n    off(events, cb) {\n        events = events instanceof Array ? events : [events];\n        for (const event of events) {\n            if (event in this._events) {\n                if (cb !== undefined) {\n                    this._events[event] = this._events[event].filter(listener => {\n                        return typeof cb === 'function' ? listener !== cb : listener.listenerName !== cb;\n                    });\n                }\n                else {\n                    this._events[event] = [];\n                }\n            }\n        }\n    }\n    offAll(id) {\n        for (const event of [...Object.getOwnPropertySymbols(this._events), ...Object.keys(this._events)]) {\n            if (id !== undefined) {\n                this._events[event] = this._events[event].filter(listener => {\n                    return typeof id === 'function' ? listener !== id : listener.listenerName !== id;\n                });\n            }\n            else {\n                this._events[event] = [];\n            }\n        }\n    }\n}\nmodule.exports = EventEmitter;\n\n\n//# sourceURL=webpack:///../EventEmitter.js?");

/***/ }),

/***/ "../fileListener.js":
/*!**************************!*\
  !*** ../fileListener.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EventEmitter = __webpack_require__(/*! ./EventEmitter */ \"../EventEmitter.js\");\nclass FileListener extends EventEmitter {\n    constructor(config = {}) {\n        super();\n        const controller = document.createElement('input');\n        controller.type = 'file';\n        this.config = Object.assign({\n            size: Infinity,\n            accept: null,\n            controller,\n            multiple: false,\n            drop: null,\n            dropClassNames: {\n                start: 'drag-start',\n                over: 'drag-over'\n            }\n        }, config);\n        this.accept = this._createAcceptString(this.config.accept);\n        this.config.controller.accept = this.accept;\n        this.config.controller.multiple = !!this.config.multiple;\n        this.config.controller.addEventListener('change', e => {\n            if (e.target.files.length) {\n                Array\n                    .from(e.target.files)\n                    .forEach(file => this._processFile(file, e));\n            }\n            else {\n                this._processFile(null, e);\n            }\n        });\n        this._drop();\n    }\n    open() {\n        this.config.controller.click();\n        return this;\n    }\n    matchesMime(mime, accept) {\n        const fileType = mime.split('/')[0];\n        return !!accept\n            .replace(/ /g, '')\n            .split(',')\n            .filter(type => {\n            if (/(\\/\\*)$/.test(type) && fileType === type.replace(/(\\/\\*)$/, ''))\n                return true;\n            return type === mime;\n        }).length;\n    }\n    _drop() {\n        if (this.config.drop) {\n            const dropZones = this.config.drop instanceof Element ? [this.config.drop] : this.config.drop;\n            for (const zone of dropZones) {\n                zone.addEventListener('drop', e => {\n                    e.preventDefault();\n                    const files = [];\n                    if (e.dataTransfer.items) {\n                        if (this.config.multiple) {\n                            Array\n                                .from(e.dataTransfer.items)\n                                .forEach(item => {\n                                if (item.kind === 'file')\n                                    files.push(item.getAsFile());\n                            });\n                        }\n                        else {\n                            files.push(e.dataTransfer.items[0].getAsFile());\n                        }\n                    }\n                    else {\n                        if (this.config.multiple)\n                            files.concat(Array.from(e.dataTransfer.files));\n                        else\n                            files.push(e.dataTransfer.files[0]);\n                    }\n                    if (files.length)\n                        files.forEach(file => this._processFile(file, e, 'drop', zone));\n                    else\n                        this._processFile(null, e, 'drop', zone);\n                    this._resetDragClasses();\n                }, false);\n                zone.addEventListener('dragenter', _ => zone.classList.add(this.config.dropClassNames.over), false);\n                zone.addEventListener('dragleave', _ => zone.classList.remove(this.config.dropClassNames.over), false);\n                zone.addEventListener('dragover', e => e.preventDefault(), false);\n            }\n            let counter = 0;\n            document.addEventListener('dragenter', _ => {\n                if (counter++ === 0)\n                    dropZones.forEach(zone => zone.classList.add(this.config.dropClassNames.start));\n            }, false);\n            document.addEventListener('dragleave', _ => {\n                if (--counter === 0)\n                    dropZones.forEach(zone => zone.classList.remove(this.config.dropClassNames.start));\n            }, false);\n            document.addEventListener('drop', _ => {\n                this._resetDragClasses();\n                counter = 0;\n            }, false);\n        }\n    }\n    _createAcceptString(accept) {\n        if (accept instanceof Array) {\n            return accept.map(mime => {\n                if (!mime.includes('/'))\n                    return mime + '/*';\n                return mime;\n            }).join(',').replace(/ /g, '');\n        }\n        else if (typeof accept === 'string')\n            return accept;\n        return '*';\n    }\n    _processFile(file, originalEvent, source = 'controller', zone = null) {\n        const event = { file, source, zone, originalEvent, toURL: () => URL.createObjectURL(file) };\n        if (file) {\n            if (this.config.accept == '*' || this.matchesMime(file.type, this.accept)) {\n                if (this.config.size >= file.size) {\n                    this.trigger('change', Object.assign(Object.assign({}, event), { empty: false }));\n                }\n                else {\n                    this.trigger('error', Object.assign(Object.assign({}, event), { message: 'File is too big', error: FileListener.FILE_IS_TOO_BIG, code: 1 }));\n                    this.config.controller.value = null;\n                }\n            }\n            else {\n                this.trigger('error', Object.assign(Object.assign({}, event), { message: 'File is not supported', error: FileListener.FILE_IS_NOT_SUPPORTED, code: 2 }));\n                this.config.controller.value = null;\n            }\n        }\n        else {\n            this.trigger('change', Object.assign(Object.assign({}, event), { empty: true }));\n        }\n        this._resetDragClasses();\n        return this;\n    }\n    _resetDragClasses() {\n        if (this.config.drop) {\n            const zones = this.config.drop instanceof Element ? [this.config.drop] : this.config.drop;\n            zones.forEach(zone => {\n                zone.classList.remove(this.config.dropClassNames.over);\n                zone.classList.remove(this.config.dropClassNames.start);\n            });\n        }\n    }\n}\nFileListener.FILE_IS_NOT_SUPPORTED = Symbol('File is not supported');\nFileListener.FILE_IS_TOO_BIG = Symbol('File is too big');\ndocument.addEventListener('dragover', e => e.preventDefault(), false);\ndocument.addEventListener('drop', e => e.preventDefault(), false);\nmodule.exports = FileListener;\n\n\n//# sourceURL=webpack:///../fileListener.js?");

/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const FileListener = __webpack_require__(/*! ../fileListener */ \"../fileListener.js\");\nconst btn = document.querySelector('#open');\nconst file = new FileListener({\n    accept: '*',\n    size: 3000000,\n    drop: document.querySelectorAll('input, button'),\n    multiple: true\n});\nbtn.addEventListener('click', () => {\n    file.open();\n});\nfile.on('change', (event) => {\n    file.trigger('error', Object.assign(Object.assign({}, event), { message: 'custom error' }));\n});\nfile.on('error', (event) => {\n    console.log(event);\n});\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ })

/******/ });