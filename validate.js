const EventEmitter = require('./EventEmitter')
// file types
// messages

class Validation extends EventEmitter {
    constructor(scheme = {}) {
        super()
        this.scheme = {}
        this.originalScheme = {}
        for (const name in scheme) {
            if (typeof scheme[name] === 'object') {
                this.scheme[name] = this.createScheme(scheme[name])
                this.originalScheme[name] = scheme[name]
            }
        }

        this.messages = {
            type: `Invalid type`,
            nullable: 'Value cannot be empty',
            min: (value, scheme) => `Value underflow`,
            max: (value, scheme) => `Value overflow`,
            pattern: 'Pattern mismatch',
            required: 'Value is required',
        }
    }


    autoPreprocess(controller, autoScheme) {
        const scheme = autoScheme ? autoScheme : this.scheme[controller.name]
        if (scheme && scheme.autoProcess) {
            switch (controller.type) {
                case 'number':
                case 'range':
                    const float = parseFloat(controller.value)
                    return typeof float === 'number' && !Number.isNaN(float) ? float : null
                case 'checkbox':
                    return controller.checked
                case 'date':
                    if (controller.value)
                        return new Date(controller.value)
                    return null

                case 'file':
                    if (controller.files.length)
                        return Array.from(controller.files)
                    return controller.files[0]
                default:
                    return controller.value
            }
        }
        return controller.value
    }

    _getNumber(value) {
        const float = parseFloat(value)

        return typeof float === 'number' && !Number.isNaN(float) ? float : null
    }

    createControllerData(controller, overrideValue) {
        const name = controller.name
        const definedScheme = this.originalScheme[name] || {}
        const endScheme = this.scheme[name] || this.createScheme({})


        let autoScheme = {}
        if ('autoValidation' in endScheme && endScheme.autoValidation) {

            const isText = /^(text|textarea|password|email|search|tel|url)$/.test(controller.type)
            const isNumber = /^(number|range)$/.test(controller.type)

            let type = null
            if ('autoProcess' in endScheme && endScheme.autoProcess) {
                if (/^(text|textarea|color|password|email|search|tel|url)$/.test(controller.type))
                    type = 'string'
                else if (/^(number|range)$/.test(controller.type))
                    type = 'number'
                else if (/^(date)$/.test(controller.type))
                    type = Date
                else if (/^(file)$/.test(controller.type) && controller.multiple)
                    type = Array
                else if (/^(file)$/.test(controller.type) && !controller.multiple)
                    type = File
            }



            let min = null
            let max = null

            if (isText) {
                min = this._getNumber(typeof controller.minLength === 'number' && controller.minLength >= 0 ? controller.minLength : null)
                max = this._getNumber(typeof controller.maxLength === 'number' && controller.maxLength >= 0 ? controller.maxLength : null)
            }
            else if (isNumber) {
                min = this._getNumber(controller.min)
                max = this._getNumber(controller.max)
            }

            autoScheme = this.createScheme({
                type,
                ref: controller,
                min,
                max,
                required: controller.required,
                pattern: controller.pattern ? new RegExp(controller.pattern) : null
            })
        }

        const scheme = Object.assign(endScheme, autoScheme, definedScheme)
        const value = overrideValue === undefined ? this.autoPreprocess(controller, scheme) : overrideValue

        return {
            value,
            scheme
        }

    }

    getFormData(form, include) {
        const controllers = Array.from(form.querySelectorAll('input[name], select[name], textarea[name]'))

        const data = {}
        controllers.filter(controller => include instanceof Array ? include.includes(controller.name) : true).forEach(controller => {
            const { name, checked, type } = controller

            if (type === 'radio') {
                if (checked)
                    data[name] = this.createControllerData(controller)
                else if (!(name in data))
                    data[name] = this.createControllerData(controller, null)
            }
            else
                data[name] = this.createControllerData(controller)

        })
        return data
    }

    extractFormData(formData) {
        const scheme = {}
        const data = {}
        for (const name in formData) {
            scheme[name] = formData[name].scheme
            data[name] = formData[name].value
        }
        return { scheme, data }
    }

    validate(objToValidate, include) {
        include = include && typeof include === 'string' ? [include] : include
        let valid = true
        const globalEvent = {}
        const finalStatus = {}
        const isForm = objToValidate instanceof HTMLFormElement


        let schemes = null
        let data = null
        let formData = null
        if (isForm) {
            formData = this.getFormData(objToValidate, include)
            const extract = this.extractFormData(formData)
            schemes = extract.scheme
            data = extract.data
        }
        else {
            schemes = this.scheme
            data = objToValidate
        }

        for (const prop in data) {
            if (prop in schemes && (include ? include.includes(prop) : true)) {
                const scheme = schemes[prop]
                const value = this.preprocess(scheme, data[prop])
                const event = {
                    value,
                    scheme,
                    originalValue: data[prop],
                    name: prop
                }

                const isValidType = this.validateType(scheme, value)
                const isValidRequired = this.validateRequired(scheme, value)
                const isValidMin = this.validateMin(scheme, value)
                const isValidMax = this.validateMax(scheme, value)
                const isCustomValid = typeof scheme.validate === 'function' ? scheme.validate.call(this, event) : null
                const isValidPattern = {}

                if (scheme.pattern instanceof Array) {
                    scheme.pattern.forEach(pattern => {
                        isValidPattern[pattern.name] = this.validatePattern(scheme, value, pattern)
                    })
                }
                else if (scheme.pattern instanceof RegExp) {
                    isValidPattern.pattern = this.validatePattern(scheme, value, scheme.pattern)
                }

                const validPatternState = {}
                for (const name in isValidPattern)
                    validPatternState[name] = !(isValidPattern[name] instanceof Error)

                const validity = {
                    isValidType: !(isValidType instanceof Error),
                    isValidRequired: !(isValidRequired instanceof Error),
                    isValidMin: !(isValidMin instanceof Error),
                    isValidMax: !(isValidMax instanceof Error),
                    isCustomValid: isCustomValid ? !(isValidMax instanceof Error) : null,
                    isValidPattern: validPatternState
                }
                const invalids = []

                if (isValidType instanceof Error)
                    invalids.push(isValidType)

                if (isValidRequired instanceof Error)
                    invalids.push(isValidRequired)

                if (isValidMin instanceof Error)
                    invalids.push(isValidMin)

                if (isValidMax instanceof Error)
                    invalids.push(isValidMax)

                if (isCustomValid instanceof Error)
                    invalids.push(isCustomValid)

                for (const name in isValidPattern)
                    if (isValidPattern[name] instanceof Error)
                        invalids.push(isValidPattern[name])

                const messages = invalids.map(error => error.message)
                const finalStatusEvent = {
                    valid: !!!invalids.length,
                    invalids,
                    message: messages.length ? messages[0] : null,
                    messages
                }

                if (typeof scheme.onError === 'function' && invalids.length)
                    scheme.onError.call(this, Object.assign({}, finalStatusEvent, event, validity))
                else if (typeof scheme.onSuccess === 'function' && !invalids.length)
                    scheme.onSuccess.call(this, Object.assign({}, finalStatusEvent, event, validity))
                if (typeof scheme.onValidate === 'function')
                    scheme.onValidate.call(this, Object.assign({}, finalStatusEvent, event, validity))

                finalStatus[prop] = Object.assign({}, finalStatusEvent, event, validity)

                if (valid)
                    valid = !invalids.length
            }
        }

        globalEvent.controllers = finalStatus
        globalEvent.valid = valid
        globalEvent.form = isForm ? objToValidate : null
        globalEvent.data = isForm ? formData : objToValidate
        this.trigger('validate', globalEvent)
        return globalEvent
    }

    preprocess(scheme, value) {
        if (typeof scheme.preprocessing === 'function')
            return scheme.preprocessing(value)
        return value
    }

    isNullAble(value) {
        return value === undefined || value === null || Number.isNaN(value) || ((value instanceof Array || typeof value === 'string') && !value.length)
    }

    getMessage(scheme, value, messageName) {
        const messages = Object.assign({}, this.processMessages(scheme, value, this.messages), this.processMessages(scheme, value, scheme.messages))
        return messages[messageName]
    }

    processMessages(scheme, value, messages) {
        const processMessages = {}
        if (messages) {
            for (const name in messages) {
                const message = messages[name]
                if (typeof message === 'function')
                    processMessages[name] = message.call(this, value, scheme)
                else
                    processMessages[name] = message
            }
        }
        return processMessages
    }

    validateType(scheme, value) {
        const expect = scheme.type
        const isNullAble = this.isNullAble(value)

        if (!scheme.nullable && isNullAble)
            return new Error(this.getMessage(scheme, value, 'nullable'))

        if (expect && !(scheme.nullable && isNullAble)) {
            if (
                (typeof expect === 'string' && typeof value !== expect) ||
                (expect instanceof Object && !(value instanceof expect))
            )
                return new Error(this.getMessage(scheme, value, 'type'))
        }
        return true
    }

    validateMin(scheme, value) {
        const min = scheme.min
        if (typeof min === 'number' && (typeof value === 'string' || typeof value === 'number' || value instanceof Array)) {
            if (
                ((typeof value === 'string' || value instanceof Array) && value.length < min) ||
                (typeof value === 'number' && value < min)
            )
                return new Error(this.getMessage(scheme, value, 'min'))
        }

        if (min instanceof Date && value instanceof Date && min.getTime() > value.getTime())
            return new Error(this.getMessage(scheme, value, 'min'))

        return true
    }

    validateMax(scheme, value) {
        const max = scheme.max
        if (typeof max === 'number' && (typeof value === 'string' || typeof value === 'number')) {
            if (
                (typeof value === 'string' && value.length > max) ||
                (typeof value === 'number' && value > max)
            )
                return new Error(this.getMessage(scheme, value, 'max'))
        }

        if (max instanceof Date && value instanceof Date && max.getTime() < value.getTime())
            return new Error(this.getMessage(scheme, value, 'max'))

        return true
    }

    validatePattern(scheme, value, patternValue) {
        const regexp = patternValue instanceof RegExp ? patternValue : patternValue.pattern
        const pattern = regexp || scheme.pattern
        const globalMessage = this.getMessage(scheme, value, 'pattern')
        const message = patternValue && patternValue.pattern ? patternValue.message || globalMessage : globalMessage

        if (pattern instanceof RegExp && !pattern.test(value))
            return new Error(message)
        return true
    }

    validateRequired(scheme, value) {
        if (scheme.required && !value || (value instanceof Array && !value.length))
            return new Error(this.getMessage(scheme, value, 'required'))
        return true
    }

    createScheme(scheme) {
        return Object.assign({
            type: null,
            nullable: true,
            min: null,
            max: null,
            pattern: null,
            required: false,
            validate: null,
            preprocessing: null,
            messages: null,
            autoProcess: true,
            autoValidation: true,
            nativeValidation: true,
            ref: null,
            onError: null,
            onSuccess: null,
            onValidate: null
        }, scheme)
    }
}

module.exports = Validation