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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return EventEmitter; });\nclass EventEmitter {\n    constructor() {\n        this._events = {};\n    }\n    _on(events, cb, name, once = false) {\n        const id = Symbol();\n        events = events instanceof Array ? events : [events];\n        if (once)\n            cb.once = true;\n        cb.listenerName = name === undefined ? id : name;\n        for (const event of events)\n            event in this._events ? this._events[event].push(cb) : this._events[event] = [cb];\n        return id;\n    }\n    on(events, cb, name) {\n        return this._on(events, cb, name, false);\n    }\n    once(events, cb, name) {\n        return this._on(events, cb, name, true);\n    }\n    trigger(event, ...data) {\n        if (event in this._events) {\n            this._events[event].forEach(listener => {\n                listener.call(this, ...data);\n                if (listener.once)\n                    this.off(event, listener);\n            });\n        }\n    }\n    off(events, cb) {\n        events = events instanceof Array ? events : [events];\n        for (const event of events) {\n            if (event in this._events) {\n                if (cb !== undefined) {\n                    this._events[event] = this._events[event].filter(listener => {\n                        return typeof cb === 'function' ? listener !== cb : listener.listenerName !== cb;\n                    });\n                }\n                else {\n                    this._events[event] = [];\n                }\n            }\n        }\n    }\n    offAll(id) {\n        for (const event of [...Object.getOwnPropertySymbols(this._events), ...Object.keys(this._events)]) {\n            if (id !== undefined) {\n                this._events[event] = this._events[event].filter(listener => {\n                    return typeof id === 'function' ? listener !== id : listener.listenerName !== id;\n                });\n            }\n            else {\n                this._events[event] = [];\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///../EventEmitter.js?");

/***/ }),

/***/ "../validate.js":
/*!**********************!*\
  !*** ../validate.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Validation; });\n/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ \"../EventEmitter.js\");\n\nclass Validation extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(scheme = {}) {\n        super();\n        this.scheme = {};\n        this.originalScheme = {};\n        for (const name in scheme) {\n            if (typeof scheme[name] === 'object') {\n                this.scheme[name] = this.createScheme(scheme[name]);\n                this.originalScheme[name] = scheme[name];\n            }\n        }\n        this.messages = {\n            type: `Invalid type`,\n            nullable: 'Value cannot be empty',\n            min: (value, scheme) => `Value underflow`,\n            max: (value, scheme) => `Value overflow`,\n            pattern: 'Pattern mismatch',\n            required: 'Value is required',\n        };\n    }\n    autoPreprocess(controller, autoScheme) {\n        const scheme = autoScheme ? autoScheme : this.scheme[controller.name];\n        if (scheme && scheme.autoProcess) {\n            switch (controller.type) {\n                case 'number':\n                case 'range':\n                    const float = parseFloat(controller.value);\n                    return typeof float === 'number' && !Number.isNaN(float) ? float : null;\n                case 'checkbox':\n                    return controller.checked;\n                case 'date':\n                    if (controller.value)\n                        return new Date(controller.value);\n                    return null;\n                case 'file':\n                    if (controller.files.length)\n                        return Array.from(controller.files);\n                    return controller.files[0];\n                default:\n                    return controller.value;\n            }\n        }\n        return controller.value;\n    }\n    _getNumber(value) {\n        const float = parseFloat(value);\n        return typeof float === 'number' && !Number.isNaN(float) ? float : null;\n    }\n    createControllerData(controller, overrideValue) {\n        const name = controller.name;\n        const definedScheme = this.originalScheme[name] || {};\n        const endScheme = this.scheme[name] || this.createScheme({});\n        let autoScheme = {};\n        if ('autoValidation' in endScheme && endScheme.autoValidation) {\n            const isText = /^(text|textarea|password|email|search|tel|url)$/.test(controller.type);\n            const isNumber = /^(number|range)$/.test(controller.type);\n            let type = null;\n            if ('autoProcess' in endScheme && endScheme.autoProcess) {\n                if (/^(text|textarea|color|password|email|search|tel|url)$/.test(controller.type))\n                    type = 'string';\n                else if (/^(number|range)$/.test(controller.type))\n                    type = 'number';\n                else if (/^(date)$/.test(controller.type))\n                    type = Date;\n                else if (/^(file)$/.test(controller.type) && controller.multiple)\n                    type = Array;\n                else if (/^(file)$/.test(controller.type) && !controller.multiple)\n                    type = File;\n            }\n            let min = null;\n            let max = null;\n            if (isText) {\n                min = this._getNumber(typeof controller.minLength === 'number' && controller.minLength >= 0 ? controller.minLength : null);\n                max = this._getNumber(typeof controller.maxLength === 'number' && controller.maxLength >= 0 ? controller.maxLength : null);\n            }\n            else if (isNumber) {\n                min = this._getNumber(controller.min);\n                max = this._getNumber(controller.max);\n            }\n            autoScheme = this.createScheme({\n                type,\n                ref: controller,\n                min,\n                max,\n                required: controller.required,\n                pattern: controller.pattern ? new RegExp(controller.pattern) : null\n            });\n        }\n        const scheme = Object.assign(endScheme, autoScheme, definedScheme);\n        const value = overrideValue === undefined ? this.autoPreprocess(controller, scheme) : overrideValue;\n        return {\n            value,\n            scheme\n        };\n    }\n    getFormData(form, include) {\n        const controllers = Array.from(form.querySelectorAll('input[name], select[name], textarea[name]'));\n        const data = {};\n        controllers.filter(controller => include instanceof Array ? include.includes(controller.name) : true).forEach(controller => {\n            const { name, checked, type } = controller;\n            if (type === 'radio') {\n                if (checked)\n                    data[name] = this.createControllerData(controller);\n                else if (!(name in data))\n                    data[name] = this.createControllerData(controller, null);\n            }\n            else\n                data[name] = this.createControllerData(controller);\n        });\n        return data;\n    }\n    extractFormData(formData) {\n        const scheme = {};\n        const data = {};\n        for (const name in formData) {\n            scheme[name] = formData[name].scheme;\n            data[name] = formData[name].value;\n        }\n        return { scheme, data };\n    }\n    validate(objToValidate, include) {\n        include = include && typeof include === 'string' ? [include] : include;\n        let valid = true;\n        const globalEvent = {};\n        const finalStatus = {};\n        const isForm = objToValidate instanceof HTMLFormElement;\n        let schemes = null;\n        let data = null;\n        let formData = null;\n        if (isForm) {\n            formData = this.getFormData(objToValidate, include);\n            const extract = this.extractFormData(formData);\n            schemes = extract.scheme;\n            data = extract.data;\n        }\n        else {\n            schemes = this.scheme;\n            data = objToValidate;\n        }\n        for (const prop in data) {\n            if (prop in schemes && (include ? include.includes(prop) : true)) {\n                const scheme = schemes[prop];\n                const value = this.preprocess(scheme, data[prop]);\n                const event = {\n                    value,\n                    scheme,\n                    originalValue: data[prop],\n                    name: prop\n                };\n                const isValidType = this.validateType(scheme, value);\n                const isValidRequired = this.validateRequired(scheme, value);\n                const isValidMin = this.validateMin(scheme, value);\n                const isValidMax = this.validateMax(scheme, value);\n                const isCustomValid = typeof scheme.validate === 'function' ? scheme.validate.call(this, event) : null;\n                const isValidPattern = {};\n                if (scheme.pattern instanceof Array) {\n                    scheme.pattern.forEach(pattern => {\n                        isValidPattern[pattern.name] = this.validatePattern(scheme, value, pattern);\n                    });\n                }\n                else if (scheme.pattern instanceof RegExp) {\n                    isValidPattern.pattern = this.validatePattern(scheme, value, scheme.pattern);\n                }\n                const validPatternState = {};\n                for (const name in isValidPattern)\n                    validPatternState[name] = !(isValidPattern[name] instanceof Error);\n                const validity = {\n                    isValidType: !(isValidType instanceof Error),\n                    isValidRequired: !(isValidRequired instanceof Error),\n                    isValidMin: !(isValidMin instanceof Error),\n                    isValidMax: !(isValidMax instanceof Error),\n                    isCustomValid: isCustomValid ? !(isValidMax instanceof Error) : null,\n                    isValidPattern: validPatternState\n                };\n                const invalids = [];\n                if (isValidType instanceof Error)\n                    invalids.push(isValidType);\n                if (isValidRequired instanceof Error)\n                    invalids.push(isValidRequired);\n                if (isValidMin instanceof Error)\n                    invalids.push(isValidMin);\n                if (isValidMax instanceof Error)\n                    invalids.push(isValidMax);\n                if (isCustomValid instanceof Error)\n                    invalids.push(isCustomValid);\n                for (const name in isValidPattern)\n                    if (isValidPattern[name] instanceof Error)\n                        invalids.push(isValidPattern[name]);\n                const messages = invalids.map(error => error.message);\n                const finalStatusEvent = {\n                    valid: !!!invalids.length,\n                    invalids,\n                    message: messages.length ? messages[0] : null,\n                    messages\n                };\n                if (typeof scheme.onError === 'function' && invalids.length)\n                    scheme.onError.call(this, Object.assign({}, finalStatusEvent, event, validity));\n                else if (typeof scheme.onSuccess === 'function' && !invalids.length)\n                    scheme.onSuccess.call(this, Object.assign({}, finalStatusEvent, event, validity));\n                if (typeof scheme.onValidate === 'function')\n                    scheme.onValidate.call(this, Object.assign({}, finalStatusEvent, event, validity));\n                finalStatus[prop] = Object.assign({}, finalStatusEvent, event, validity);\n                if (valid)\n                    valid = !invalids.length;\n            }\n        }\n        globalEvent.controllers = finalStatus;\n        globalEvent.valid = valid;\n        globalEvent.form = isForm ? objToValidate : null;\n        globalEvent.data = isForm ? formData : objToValidate;\n        this.trigger('validate', globalEvent);\n        return globalEvent;\n    }\n    preprocess(scheme, value) {\n        if (typeof scheme.preprocessing === 'function')\n            return scheme.preprocessing(value);\n        return value;\n    }\n    isNullAble(value) {\n        return value === undefined || value === null || Number.isNaN(value) || ((value instanceof Array || typeof value === 'string') && !value.length);\n    }\n    getMessage(scheme, value, messageName) {\n        const messages = Object.assign({}, this.processMessages(scheme, value, this.messages), this.processMessages(scheme, value, scheme.messages));\n        return messages[messageName];\n    }\n    processMessages(scheme, value, messages) {\n        const processMessages = {};\n        if (messages) {\n            for (const name in messages) {\n                const message = messages[name];\n                if (typeof message === 'function')\n                    processMessages[name] = message.call(this, value, scheme);\n                else\n                    processMessages[name] = message;\n            }\n        }\n        return processMessages;\n    }\n    validateType(scheme, value) {\n        const expect = scheme.type;\n        const isNullAble = this.isNullAble(value);\n        if (!scheme.nullable && isNullAble)\n            return new Error(this.getMessage(scheme, value, 'nullable'));\n        if (expect && !(scheme.nullable && isNullAble)) {\n            if ((typeof expect === 'string' && typeof value !== expect) ||\n                (expect instanceof Object && !(value instanceof expect)))\n                return new Error(this.getMessage(scheme, value, 'type'));\n        }\n        return true;\n    }\n    validateMin(scheme, value) {\n        const min = scheme.min;\n        if (typeof min === 'number' && (typeof value === 'string' || typeof value === 'number' || value instanceof Array)) {\n            if (((typeof value === 'string' || value instanceof Array) && value.length < min) ||\n                (typeof value === 'number' && value < min))\n                return new Error(this.getMessage(scheme, value, 'min'));\n        }\n        if (min instanceof Date && value instanceof Date && min.getTime() > value.getTime())\n            return new Error(this.getMessage(scheme, value, 'min'));\n        return true;\n    }\n    validateMax(scheme, value) {\n        const max = scheme.max;\n        if (typeof max === 'number' && (typeof value === 'string' || typeof value === 'number')) {\n            if ((typeof value === 'string' && value.length > max) ||\n                (typeof value === 'number' && value > max))\n                return new Error(this.getMessage(scheme, value, 'max'));\n        }\n        if (max instanceof Date && value instanceof Date && max.getTime() < value.getTime())\n            return new Error(this.getMessage(scheme, value, 'max'));\n        return true;\n    }\n    validatePattern(scheme, value, patternValue) {\n        const regexp = patternValue instanceof RegExp ? patternValue : patternValue.pattern;\n        const pattern = regexp || scheme.pattern;\n        const globalMessage = this.getMessage(scheme, value, 'pattern');\n        const message = patternValue && patternValue.pattern ? patternValue.message || globalMessage : globalMessage;\n        if (pattern instanceof RegExp && !pattern.test(value))\n            return new Error(message);\n        return true;\n    }\n    validateRequired(scheme, value) {\n        if (scheme.required && !value || (value instanceof Array && !value.length))\n            return new Error(this.getMessage(scheme, value, 'required'));\n        return true;\n    }\n    createScheme(scheme) {\n        return Object.assign({\n            type: null,\n            nullable: true,\n            min: null,\n            max: null,\n            pattern: null,\n            required: false,\n            validate: null,\n            preprocessing: null,\n            messages: null,\n            autoProcess: true,\n            autoValidation: true,\n            nativeValidation: true,\n            ref: null,\n            onError: null,\n            onSuccess: null,\n            onValidate: null\n        }, scheme);\n    }\n}\n\n\n//# sourceURL=webpack:///../validate.js?");

/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _validate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../validate */ \"../validate.js\");\n\nconst btn = document.querySelector('button');\nconst form = document.querySelector('form');\nconst validation = new _validate__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n    text: {\n        min: 4\n    }\n});\nbtn.addEventListener('click', () => {\n});\nvalidation.on('validate', (e) => {\n    for (const name in e.controllers) {\n        const state = e.controllers[name];\n        if (state.valid) {\n            state.scheme.ref.parentElement.querySelector('span').innerHTML = '';\n            state.scheme.ref.style.background = 'green';\n        }\n        else {\n            state.scheme.ref.parentElement.querySelector('span').innerHTML = state.message;\n            state.scheme.ref.style.background = 'red';\n        }\n    }\n});\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ })

/******/ });