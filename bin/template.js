/**! @license
  * template.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

module.exports = {
    typescript(component, css){

        const import_css = css === true ? `import './${component}.sass'\n` : ''

        return `${import_css}import { React } from 'ts-modules/react'

export default class ${component} extends React.Component<any, any> {
    render() {
        return (
            <div id="${component}">
                <h2>${component} work!</h2>
            </div>
        )
    }
}`
    },

    css(component) {
        return `@import "../../../node_modules/ts-modules/lib"

#${component}
    h2
        color: #444`
    }
}