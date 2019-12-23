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
        const prefixs = ['webkit', 'moz', 'o', 'ms']

        let style = property.replace(/\-.{1}/g, m => m.toUpperCase()).replace(/\-/g, '')

        if (elem.style[style] === undefined) {
            prefixs.forEach(prefix => {
                const prop = prefix + style.replace(/^.{1}/, m => m.toUpperCase())
                if (elem.style[prop] !== undefined)
                    style = prop
            })
        }

        return style
    }


    if (typeof styles === 'string')
        elem.style[setPrefixIfNeeded(styles)] = value + ''

    else {
        for (const style in styles)
            elem.style[setPrefixIfNeeded(style)] = styles[style]
    }
}

module.exports = setStyles
