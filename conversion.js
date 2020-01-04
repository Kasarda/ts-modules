/**! @license
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

const Unit = (_ => {
    class UnitValue {
        constructor(value, unit) {
            this.value = value
            this.unit = unit

            if (typeof unit.root === 'function')
                this.basic = unit.root.call(this, value).toBasic
            else
                this.basic = value * unit.root
        }

        toString(fixed) {
            const value = typeof fixed === 'number' ? Number(this.value).toFixed(fixed) : this.value
            return `${value}${this.unit.symbol}`
        }
    }

    class UnitType {
        constructor(type) {
            this.symbol = type.symbol
            this.name = type.name
            this.type = type.type
            this.system = type.system
            this.root = type.root
        }

        convert(value) {
            if (typeof this.root === 'function')
                return this.setValue(this.root.call(this, value).fromBasic)
            return this.setValue(value / this.root)
        }

        setValue(value) {
            return new UnitValue(value, this)
        }
    }

    function createUnit(type) {
        const unit = new UnitType(type)
        function fn(value = 0) { return unit.setValue(value) }
        fn.prototype.unit = unit
        return fn
    }



    return {
        toMetricHeight(foot, inches = 0, lengthType = this.length.cm) {
            const inch = this.imperialHeightToInches(foot, inches)
            return this.convert(this.length.in(inch), lengthType).value
        },

        toImperialHeight(length) {
            const inches = this.convert(length, this.length.in).value
            return this.inchesToImperialHeight(inches)
        },

        inchesToImperialHeight(inches) {
            if (Number.isFinite(inches)) {
                const foot = inches / 12
                const imperialFoot = Math.floor(foot)
                const imperialInches = (foot - imperialFoot) * 12
                return [imperialFoot, imperialInches]
            }
            return []
        },

        imperialHeightToInches(foot, inches = 0) {
            if (Number.isFinite(foot))
                return (foot * 12) + inches
        },

        convert(from, to) {
            if (typeof to === 'function')
                to = to.prototype.unit

            if (from.unit.type !== to.type)
                throw new TypeError(`Can't convert ${from.unit.type} to ${to.type}`)
            return to.convert(from.basic)
        },

        describe(unit) {
            return unit.prototype.unit
        },

        describeAll() {
            const preDescribe = units => {
                const obj = {}
                for (const unit in units) {
                    if (unit !== 'BASIC_UNIT' && unit !== 'add')
                        obj[unit] = units[unit].prototype.unit
                }
                return obj
            }
            return {
                mass: preDescribe(this.mass),
                length: preDescribe(this.length),
                volume: preDescribe(this.volume),
                angle: preDescribe(this.angle),
                time: preDescribe(this.time),
                temperature: preDescribe(this.temperature),
                speed: preDescribe(this.speed),
                area: preDescribe(this.area),
                energy: preDescribe(this.energy),
                frequency: preDescribe(this.frequency),
                pressure: preDescribe(this.pressure),
                data: preDescribe(this.data),
                custom: preDescribe(this.custom)
            }
        },

        getUnitBy() { },

        TYPES: [
            'mass',
            'length',
            'volume',
            'volumeFlowRate',
            'angle',
            'time',
            'temperature',
            'speed',
            'energy',
            'frequency',
            'pressure',
            'data',
            'illuminance',
            'pace',
            'voltage',
            'current',
            'power',
            'force',
            'area',
            'sound'
        ],

        mass: {
            mcg: createUnit({ symbol: 'mcg', name: 'microgram', type: 'mass', system: 'metric', root: 0.000001 }),
            mg: createUnit({ symbol: 'mg', name: 'miligram', type: 'mass', system: 'metric', root: 0.001 }),
            g: createUnit({ symbol: 'g', name: 'gram', type: 'mass', system: 'metric', root: 1 }),
            kg: createUnit({ symbol: 'kg', name: 'kilogram', type: 'mass', system: 'metric', root: 1000 }),
            t: createUnit({ symbol: 't', name: 'tonne', type: 'mass', system: 'metric', root: 1000000 }),
            lb: createUnit({ symbol: 'lb', name: 'pound', type: 'mass', system: 'imperial', root: 453.592292 }),
            oz: createUnit({ symbol: 'oz', name: 'ounce', type: 'mass', system: 'imperial', root: 28.349518 }),
            UKst: createUnit({ symbol: 'st(UK)', name: 'stone (UK)', type: 'mass', system: 'imperial', root: 6350.292091 }),
            USst: createUnit({ symbol: 'st(US)', name: 'stone (US)', type: 'mass', system: 'imperial', root: 5669.903652 }),
            BASIC_UNIT: 'g'
        },

        length: {
            mm: createUnit({ symbol: 'mm', name: 'milimeter', type: 'length', system: 'metric', root: 1 }),
            cm: createUnit({ symbol: 'cm', name: 'centimeter', type: 'length', system: 'metric', root: 10 }),
            dm: createUnit({ symbol: 'dm', name: 'decimeter', type: 'length', system: 'metric', root: 100 }),
            m: createUnit({ symbol: 'm', name: 'meter', type: 'length', system: 'metric', root: 1000 }),
            km: createUnit({ symbol: 'km', name: 'kilometer', type: 'length', system: 'metric', root: 1000000 }),
            mi: createUnit({ symbol: 'mi', name: 'mile', type: 'length', system: 'imperial', root: 1609344.000006 }),
            in: createUnit({ symbol: 'in', name: 'inch', type: 'length', system: 'imperial', root: 25.4 }),
            ft: createUnit({ symbol: 'ft', name: 'foot', type: 'length', system: 'imperial', root: 304.8 }),
            yd: createUnit({ symbol: 'yd', name: 'yard', type: 'length', system: 'imperial', root: 914.4 }),
            ly: createUnit({ symbol: 'ly', name: 'light year', type: 'length', system: 'metric', root: 9433962000000000000 }),
            BASIC_UNIT: 'mm'
        },

        volume: {
            mL: createUnit({ symbol: 'mL', name: 'mililiter', type: 'volume', system: 'metric', root: 1 }),
            cL: createUnit({ symbol: 'cL', name: 'centiliter', type: 'volume', system: 'metric', root: 10 }),
            dL: createUnit({ symbol: 'dL', name: 'deciliter', type: 'volume', system: 'metric', root: 100 }),
            L: createUnit({ symbol: 'L', name: 'liter', type: 'volume', system: 'metric', root: 1000 }),
            hL: createUnit({ symbol: 'hl', name: 'hectoliter', type: 'volume', system: 'metric', root: 100000 }),
            kL: createUnit({ symbol: 'kl', name: 'kiloliter', type: 'volume', system: 'metric', root: 1000000 }),
            m3: createUnit({ symbol: 'm3', name: 'cubic meter', type: 'volume', system: 'metric', root: 1000000 }),
            mm3: createUnit({ symbol: 'mm3', name: 'cubic milimeter', type: 'volume', system: 'metric', root: 0.001 }),
            cm3: createUnit({ symbol: 'cm3', name: 'cubic centimeter', type: 'volume', system: 'metric', root: 1 }),
            km3: createUnit({ symbol: 'km3', name: 'cubic kilometer', type: 'volume', system: 'metric', root: 1000000000000000 }),
            in3: createUnit({ symbol: 'in3', name: 'cubic inch', type: 'volume', system: 'imperial', root: 16.387064 }),
            ft3: createUnit({ symbol: 'ft3', name: 'cubic foot', type: 'volume', system: 'imperial', root: 28316.846594 }),
            yd3: createUnit({ symbol: 'yd3', name: 'cubic yard', type: 'volume', system: 'imperial', root: 764554.858043 }),
            mi3: createUnit({ symbol: 'mi3', name: 'cubic mile', type: 'volume', system: 'imperial', root: 4162314000000000 }),
            USgal: createUnit({ symbol: 'gal(US)', name: 'gallon (US)', type: 'volume', system: 'imperial', root: 3785.411784 }),
            UKgal: createUnit({ symbol: 'gal(UK)', name: 'gallon (UK)', type: 'volume', system: 'imperial', root: 4546.09 }),
            qt: createUnit({ symbol: 'qt', name: 'liquid quart (US)', type: 'volume', system: 'imperial', root: 946.352946 }),//
            pnt: createUnit({ symbol: 'pnt', name: 'liquid pint (US)', type: 'volume', system: 'imperial', root: 473.176473 }),
            cup: createUnit({ symbol: 'cup', name: 'cup', type: 'volume', system: 'metric', root: 250 }),
            floz: createUnit({ symbol: 'floz', name: 'fluid ounce (US)', type: 'volume', system: 'imperial', root: 29.5735 }),
            Tbs: createUnit({ symbol: 'Tbs', name: 'tablespoon', type: 'volume', system: 'metric', root: 15 }),
            USTbs: createUnit({ symbol: 'Tbs(US)', name: 'tablespoon (US)', type: 'volume', system: 'imperial', root: 14.786765 }),
            UKTbs: createUnit({ symbol: 'Tbs(UK)', name: 'tablespoon (UK)', type: 'volume', system: 'imperial', root: 17.758164 }),
            tsp: createUnit({ symbol: 'tsp', name: 'teaspoon', type: 'volume', system: 'metric', root: 5 }),
            UStsp: createUnit({ symbol: 'tsp(US)', name: 'teaspoon (US)', type: 'volume', system: 'imperial', root: 4.928922 }),
            UKtsp: createUnit({ symbol: 'tsp(UK)', name: 'teaspoon (UK)', type: 'volume', system: 'imperial', root: 5.919388 }),
            BASIC_UNIT: 'ml'
        },

        volumeFlowRate: {
            m3s: createUnit({ symbol: 'm3/s', name: 'cubic meter per second', type: 'volume flow rate', system: 'metric', root: 1 }),
            m3min: createUnit({ symbol: 'm3/min', name: 'cubic meter per minute', type: 'volume flow rate', system: 'metric', root: 0.0166666667 }),
            m3h: createUnit({ symbol: 'm3/h', name: 'cubic meter per hour', type: 'volume flow rate', system: 'metric', root: 0.000277777778 }),
            cm3s: createUnit({ symbol: 'cm3/s', name: 'cubic centimeter per second', type: 'volume flow rate', system: 'metric', root: 0.000001 }),
            cm3min: createUnit({ symbol: 'cm3/min', name: 'cubic centimeter per minute', type: 'volume flow rate', system: 'metric', root: 0.0000000166666667 }),
            cm3h: createUnit({ symbol: 'cm3/h', name: 'cubic centimeter per hour', type: 'volume flow rate', system: 'metric', root: 0.0000000002777777730056385507850791327655315399169921875 }),
            ls: createUnit({ symbol: 'l/s', name: 'liter per second', type: 'volume flow rate', system: 'metric', root: 0.001 }),
            lmin: createUnit({ symbol: 'l/min', name: 'liter per minute', type: 'volume flow rate', system: 'metric', root: 0.0000166666667 }),
            lh: createUnit({ symbol: 'l/h', name: 'liter per hour', type: 'volume flow rate', system: 'metric', root: 0.000000277777778 }),
            ft3s: createUnit({ symbol: 'ft3/s', name: 'cubic foot per second', type: 'volume flow rate', system: 'imperial', root: 0.0283168464 }),
            ft3min: createUnit({ symbol: 'ft3/min', name: 'cubic foot per minute', type: 'volume flow rate', system: 'imperial', root: 0.000471947444 }),
            ft3h: createUnit({ symbol: 'ft3/h', name: 'cubic foot per hour', type: 'volume flow rate', system: 'imperial', root: 0.00000786579073 }),
            in3s: createUnit({ symbol: 'in3/s', name: 'cubic inch per second', type: 'volume flow rate', system: 'imperial', root: 0.000016387064 }),
            in3min: createUnit({ symbol: 'in3/min', name: 'cubic inch per minute', type: 'volume flow rate', system: 'imperial', root: 0.000000273117737 }),
            in3h: createUnit({ symbol: 'in3/h', name: 'cubic inch per hour', type: 'volume flow rate', system: 'imperial', root: 0.0000000045519622 }),
            yd3s: createUnit({ symbol: 'yd3/s', name: 'cubic yard per second', type: 'volume flow rate', system: 'imperial', root: 0.764555 }),
            yd3min: createUnit({ symbol: 'yd3/min', name: 'cubic yard per minute', type: 'volume flow rate', system: 'imperial', root: 0.01274258 }),
            yd3h: createUnit({ symbol: 'yd3/h', name: 'cubic yard per hour', type: 'volume flow rate', system: 'imperial', root: 0.0002123763 }),
            BASIC_UNIT: 'm3/s'
        },

        angle: {
            deg: createUnit({ symbol: 'deg', name: 'degree', type: 'angle', system: 'metric', root: 1 }),
            rad: createUnit({ symbol: 'rad', name: 'radian', type: 'angle', system: 'metric', root: 57.295778 }),
            grad: createUnit({ symbol: 'grad', name: 'gradian', type: 'angle', system: 'metric', root: 0.9 }),
            turn: createUnit({ symbol: 'turn', name: 'turn', type: 'angle', system: 'metric', root: 360 }),
            arcmin: createUnit({ symbol: 'arcmin', name: 'minute of arc', type: 'angle', system: 'metric', root: 0.016666666666666666 }),
            arcsec: createUnit({ symbol: 'arcsec', name: 'second of arc', type: 'angle', system: 'metric', root: 0.0002777777777777778 }),
            BASIC_UNIT: 'deg'
        },

        time: {
            ms: createUnit({ symbol: 'ms', name: 'milisecond', type: 'time', system: 'metric', root: 1 }),
            s: createUnit({ symbol: 's', name: 'second', type: 'time', system: 'metric', root: 1000 }),
            min: createUnit({ symbol: 'min', name: 'minute', type: 'time', system: 'metric', root: 60000 }),
            h: createUnit({ symbol: 'h', name: 'hour', type: 'time', system: 'metric', root: 3600000 }),
            d: createUnit({ symbol: 'd', name: 'day', type: 'time', system: 'metric', root: 86400000.000001 }),
            week: createUnit({ symbol: 'week', name: 'week', type: 'time', system: 'metric', root: 604800000 }),
            month: createUnit({ symbol: 'month', name: 'month', type: 'time', system: 'metric', root: 2628000000 }),
            year: createUnit({ symbol: 'year', name: 'year', type: 'time', system: 'metric', root: 31536000000 }),
            decade: createUnit({ symbol: 'decade', name: 'decade', type: 'time', system: 'metric', root: 315360000000 }),
            century: createUnit({ symbol: 'century', name: 'century', type: 'time', system: 'metric', root: 3153600000000 }),
            BASIC_UNIT: 'ms'
        },

        temperature: {
            C: createUnit({ symbol: 'C', name: 'celsius', type: 'temperature', system: 'metric', root: 1 }),
            K: createUnit({
                symbol: 'K', name: 'kelvin', type: 'temperature', system: 'metric', root: val => ({
                    toBasic: val - 273.15,
                    fromBasic: val + 273.15
                })
            }),
            F: createUnit({
                symbol: 'F', name: 'fahrenheit', type: 'temperature', system: 'imperial', root: val => ({
                    toBasic: (val - 32) * (5 / 9),
                    fromBasic: (val * (9 / 5)) + 32
                })
            }),
            Ra: createUnit({
                symbol: 'Ra', name: 'rankine scale', type: 'temperature', system: 'metric', root: val => ({
                    toBasic: (val - 491.67) * (5 / 9),
                    fromBasic: (val * (9 / 5)) + 491.67
                })
            }),
            Re: createUnit({ symbol: 'Re', name: 'rankine scale', type: 'temperature', system: 'metric', root: 1.25 }),
            BASIC_UNIT: 'c'
        },

        speed: {
            mps: createUnit({ symbol: 'mps', name: 'meter per second', type: 'speed', system: 'metric', root: 1 }),
            mmin: createUnit({ symbol: 'm/min', name: 'meter per minute', type: 'speed', system: 'metric', root: 0.01666667 }),
            kph: createUnit({ symbol: 'kph', name: 'kilometer per hour', type: 'speed', system: 'metric', root: 0.277778 }),
            kmmin: createUnit({ symbol: 'km/min', name: 'kilometer per minute', type: 'speed', system: 'metric', root: 16.666667 }),
            kms: createUnit({ symbol: 'km/s', name: 'kilometer per second', type: 'speed', system: 'metric', root: 1000 }),
            mph: createUnit({ symbol: 'mph', name: 'mile per hour', type: 'speed', system: 'imperial', root: 0.44704 }),
            mimin: createUnit({ symbol: 'mi/min', name: 'mile per minute', type: 'speed', system: 'imperial', root: 26.822409 }),
            mis: createUnit({ symbol: 'mi/s', name: 'mile per second', type: 'speed', system: 'imperial', root: 1609.344498 }),
            kn: createUnit({ symbol: 'kn', name: 'knot', type: 'speed', system: 'imperial', root: 0.514444 }),
            fts: createUnit({ symbol: 'ft/s', name: 'foot per second', type: 'speed', system: 'imperial', root: 0.3048 }),
            yds: createUnit({ symbol: 'yd/s', name: 'yard per second', type: 'speed', system: 'imperial', root: 0.9144 }),
            ydmin: createUnit({ symbol: 'yd/min', name: 'yard per minute', type: 'speed', system: 'imperial', root: 0.01524 }),
            ydh: createUnit({ symbol: 'yd/h', name: 'yard per hour', type: 'speed', system: 'imperial', root: 0.000254 }),
            BASIC_UNIT: 'mps'
        },

        area: {
            mm2: createUnit({ symbol: 'mm2', name: 'square milimeter', type: 'area', system: 'metric', root: 0.000001 }),
            cm2: createUnit({ symbol: 'cm2', name: 'square centimeter', type: 'area', system: 'metric', root: 0.0001 }),
            m2: createUnit({ symbol: 'm2', name: 'square meter', type: 'area', system: 'metric', root: 1 }),
            km2: createUnit({ symbol: 'km2', name: 'square kilometer', type: 'area', system: 'metric', root: 1000000 }),
            mi2: createUnit({ symbol: 'mi2', name: 'square miles', type: 'area', system: 'imperial', root: 2589988.110346 }),
            yd2: createUnit({ symbol: 'yd2', name: 'square yards', type: 'area', system: 'imperial', root: 0.836127 }),
            ft2: createUnit({ symbol: 'ft2', name: 'square feet', type: 'area', system: 'imperial', root: 0.09290304 }),
            in2: createUnit({ symbol: 'in2', name: 'square inches', type: 'area', system: 'imperial', root: 0.00064516 }),
            ha: createUnit({ symbol: 'ha', name: 'hectare', type: 'area', system: 'metric', root: 10000 }),
            a: createUnit({ symbol: 'a', name: 'are', type: 'area', system: 'metric', root: 100 }),
            ac: createUnit({ symbol: 'ac', name: 'acre', type: 'area', system: 'metric', root: 4046.856422 }),
            b: createUnit({ symbol: 'b', name: 'barn', type: 'area', system: 'metric', root: 0.00000000000000000000000000010000000031710768509710513471352647538147514756461109453056224083411507308483123779296875 }),
            BASIC_UNIT: 'm2'
        },

        energy: {
            J: createUnit({ symbol: 'J', name: 'joule', type: 'energy', system: 'metric', root: 1 }),
            kJ: createUnit({ symbol: 'kJ', name: 'kilojoule', type: 'energy', system: 'metric', root: 1000 }),
            MJ: createUnit({ symbol: 'MJ', name: 'megajoule', type: 'energy', system: 'metric', root: 1000000 }),
            GJ: createUnit({ symbol: 'GJ', name: 'gigajoule', type: 'energy', system: 'metric', root: 1000000000 }),
            cal: createUnit({ symbol: 'cal', name: 'calorie', type: 'energy', system: 'metric', root: 4.186798 }),
            Wh: createUnit({ symbol: 'Wh', name: 'watt hour', type: 'energy', system: 'metric', root: 3600 }),
            MWh: createUnit({ symbol: 'MWh', name: 'megawatt hour', type: 'energy', system: 'metric', root: 3600000000 }),
            kWh: createUnit({ symbol: 'kWh', name: 'kilowatt hour', type: 'energy', system: 'metric', root: 3600000 }),
            GWh: createUnit({ symbol: 'GWh', name: 'gigawatt hour', type: 'energy', system: 'metric', root: 3600000000000 }),
            BASIC_UNIT: 'J'
        },

        frequency: {
            Hz: createUnit({ symbol: 'Hz', name: 'hertz', type: 'frequency', system: 'metric', root: 1 }),
            mHz: createUnit({ symbol: 'mHz', name: 'milihertz', type: 'frequency', system: 'metric', root: 0.001 }),
            kHz: createUnit({ symbol: 'kHz', name: 'kilohertz', type: 'frequency', system: 'metric', root: 1000 }),
            MHz: createUnit({ symbol: 'MHz', name: 'megahertz', type: 'frequency', system: 'metric', root: 1000000 }),
            GHz: createUnit({ symbol: 'GHz', name: 'gigahertz', type: 'frequency', system: 'metric', root: 1000000000 }),
            THz: createUnit({ symbol: 'THz', name: 'terahertz', type: 'frequency', system: 'metric', root: 1000000000000 }),
            rpm: createUnit({ symbol: 'rpm', name: 'revolutions per minute ', type: 'frequency', system: 'metric', root: 0.016666666666666666 }),
            degs: createUnit({ symbol: 'deg/s', name: 'degrees per second ', type: 'frequency', system: 'metric', root: 0.00277777777777778 }),
            rads: createUnit({ symbol: 'rad/s', name: 'radians per second ', type: 'frequency', system: 'metric', root: 0.159154943091895 }),
            BASIC_UNIT: 'Hz'
        },

        pressure: {
            Pa: createUnit({ symbol: 'Pa', name: 'pascal', type: 'pressure', system: 'metric', root: 1 }),
            hPa: createUnit({ symbol: 'hPa', name: 'hectopascal', type: 'pressure', system: 'metric', root: 100 }),
            kPa: createUnit({ symbol: 'kPa', name: 'kilopascal', type: 'pressure', system: 'metric', root: 1000 }),
            MPa: createUnit({ symbol: 'MPa', name: 'megapascal', type: 'pressure', system: 'metric', root: 1000000 }),
            GPa: createUnit({ symbol: 'GPa', name: 'gigapascal', type: 'pressure', system: 'metric', root: 1000000000 }),
            TPa: createUnit({ symbol: 'TPa', name: 'terapascal', type: 'pressure', system: 'metric', root: 1000000000000 }),
            mbar: createUnit({ symbol: 'mbar', name: 'milibar', type: 'pressure', system: 'metric', root: 100 }),
            bar: createUnit({ symbol: 'bar', name: 'bar', type: 'pressure', system: 'metric', root: 100000 }),
            torr: createUnit({ symbol: 'torr', name: 'torr', type: 'pressure', system: 'metric', root: 133.322365 }),
            psi: createUnit({ symbol: 'psi', name: 'pound per square inch', type: 'pressure', system: 'metric', root: 6894.744825 }),
            ksi: createUnit({ symbol: 'ksi', name: 'kilopound per square inch', type: 'pressure', system: 'metric', root: 6894744.825494 }),
            BASIC_UNIT: 'Pa'
        },

        data: {
            b: createUnit({ symbol: 'b', name: 'bit', type: 'data', system: 'metric', root: 1 }),
            Kb: createUnit({ symbol: 'Kb', name: 'kilobit', type: 'data', system: 'metric', root: 1000 }),
            Mb: createUnit({ symbol: 'Mb', name: 'megabit', type: 'data', system: 'metric', root: 1000000 }),
            Gb: createUnit({ symbol: 'Gb', name: 'gigabit', type: 'data', system: 'metric', root: 1000000000 }),
            Tb: createUnit({ symbol: 'Tb', name: 'terabit', type: 'data', system: 'metric', root: 1000000000000 }),
            Pb: createUnit({ symbol: 'Pb', name: 'petabit', type: 'data', system: 'metric', root: 1000000000000000 }),
            B: createUnit({ symbol: 'B', name: 'byte', type: 'data', system: 'metric', root: 8 }),
            kB: createUnit({ symbol: 'kB', name: 'kilobyte', type: 'data', system: 'metric', root: 8000 }),
            MB: createUnit({ symbol: 'MB', name: 'megabyte', type: 'data', system: 'metric', root: 8000000 }),
            GB: createUnit({ symbol: 'GB', name: 'megabyte', type: 'data', system: 'metric', root: 8000000000 }),
            TB: createUnit({ symbol: 'TB', name: 'terabyte', type: 'data', system: 'metric', root: 8000000000000 }),
            PB: createUnit({ symbol: 'PB', name: 'petabyte', type: 'data', system: 'metric', root: 8000000000000000 }),
            BASIC_UNIT: 'g'
        },

        illuminance: {
            lx: createUnit({ symbol: 'lx', name: 'lux', type: 'illuminance', system: 'metric', root: 1 }),
            ftcd: createUnit({ symbol: 'ft-cd', name: 'foot candle', type: 'illuminance', system: 'metric', root: 10.76391 }),
            BASIC_UNIT: 'lx'
        },

        pace: {
            spm: createUnit({ symbol: 's/m', name: 'second per meter', type: 'pace', system: 'metric', root: 1 }),
            minpkm: createUnit({ symbol: 'min/km', name: 'minute per kilometer', type: 'pace', system: 'metric', root: 0.06 }),
            spyd: createUnit({ symbol: 's/yd', name: 'second per yard', type: 'pace', system: 'metric', root: 1.0936133 }),
            minpmi: createUnit({ symbol: 'min/mi', name: 'minute per mile', type: 'pace', system: 'metric', root: 0.0372823 }),
            BASIC_UNIT: 's/m'
        },

        voltage: {
            V: createUnit({ symbol: 'V', name: 'volt', type: 'voltage', system: 'metric', root: 1 }),
            mV: createUnit({ symbol: 'mV', name: 'millivolt', type: 'voltage', system: 'metric', root: 0.001 }),
            kV: createUnit({ symbol: 'kV', name: 'kilovolt', type: 'voltage', system: 'metric', root: 1000 }),
            MV: createUnit({ symbol: 'MV', name: 'megavolt', type: 'voltage', system: 'metric', root: 1000000 }),
            BASIC_UNIT: 'V'
        },

        current: {
            A: createUnit({ symbol: 'A', name: 'ampere', type: 'current', system: 'metric', root: 1 }),
            mA: createUnit({ symbol: 'mA', name: 'milliampere', type: 'current', system: 'metric', root: 0.001 }),
            kA: createUnit({ symbol: 'kA', name: 'kiloampere', type: 'current', system: 'metric', root: 1000 }),
            MA: createUnit({ symbol: 'MA', name: 'megaampere', type: 'current', system: 'metric', root: 1000000 }),
            BASIC_UNIT: 'A'
        },

        power: {
            W: createUnit({ symbol: 'W', name: 'watt', type: 'power', system: 'metric', root: 1 }),
            mW: createUnit({ symbol: 'mW', name: 'milliwatt', type: 'power', system: 'metric', root: 0.001 }),
            kW: createUnit({ symbol: 'kW', name: 'kilowatt', type: 'power', system: 'metric', root: 1000 }),
            MW: createUnit({ symbol: 'MW', name: 'megawatt', type: 'power', system: 'metric', root: 1000000 }),
            GW: createUnit({ symbol: 'GW', name: 'gigawatt', type: 'power', system: 'metric', root: 1000000000 }),
            TW: createUnit({ symbol: 'TW', name: 'terawatt', type: 'power', system: 'metric', root: 1000000000000 }),
            BASIC_UNIT: 'W'
        },

        force: {
            N: createUnit({ symbol: 'N', name: 'newton', type: 'force', system: 'metric', root: 1 }),
            daN: createUnit({ symbol: 'hN', name: 'dekanewton', type: 'force', system: 'metric', root: 10 }),
            hN: createUnit({ symbol: 'hN', name: 'hectonewton', type: 'force', system: 'metric', root: 100 }),
            kN: createUnit({ symbol: 'kN', name: 'kilonewton', type: 'force', system: 'metric', root: 1000 }),
            MN: createUnit({ symbol: 'MN', name: 'meganewton', type: 'force', system: 'metric', root: 1000000 }),
            GN: createUnit({ symbol: 'GN', name: 'giganewton', type: 'force', system: 'metric', root: 1000000000 }),
            TN: createUnit({ symbol: 'TN', name: 'teranewton', type: 'force', system: 'metric', root: 1000000000000 }),
            dyn: createUnit({ symbol: 'dyn', name: 'dyne', type: 'force', system: 'metric', root: 0.00001 }),
            p: createUnit({ symbol: 'p', name: 'pond', type: 'force', system: 'metric', root: 0.00980665 }),
            BASIC_UNIT: 'N'
        },

        sound: {
            B: createUnit({ symbol: 'B', name: 'bel', type: 'sound', system: 'metric', root: 1 }),
            dB: createUnit({ symbol: 'B', name: 'decibel', type: 'sound', system: 'metric', root: 0.1 }),
            N: createUnit({ symbol: 'N', name: 'neper', type: 'sound', system: 'metric', root: 0.8686 }),
            BASIC_UNIT: 'B'
        },

        custom: {},
        add(unit) {
            if (this.TYPES.includes(unit.type)) {
                if (unit.symbol in this[unit.type])
                    throw new Error(`Unit ${unit.symbol} already exist in ${unit.type}`)
                this[unit.type][unit.symbol] = createUnit(unit)
            }
            else {
                if (unit.symbol in this.custom)
                    throw new Error(`Unit ${unit.symbol} already exist in custom`)
                this.custom[unit.symbol] = createUnit(unit)
            }
        }
    }

})()
