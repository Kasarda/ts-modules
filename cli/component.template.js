module.exports = function (type, component, ext, no_css_flag){
    if(type === 'ts') {
        const import_css = no_css_flag ? '' : `import './${component}.${ext}'` 
        return `${import_css}

import {
    Component,
    React,
    ReactDOM
} from '@modules/react'



export default class ${component.replace(/./, m => m.toUpperCase())} extends Component {

    render() {
        return (
            <div id="${component}">
                <h2>${component} work!</h2>
            </div>
        )
    }

}`
    }
    else if(type === 'css') {
        let sass_lib = ext === 'sass' ? '@import "../../../node_modules/@modules/lib"' : ''

        return `${sass_lib}
        
#${component}
    h2
        color: #444
`
    }
}
