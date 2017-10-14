#!/usr/bin/env node

/**! @license
  * component.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

const fs = require('fs')
const { join } = require('path')
const template = require('./template')
const { reset, cyan, red, green } = require('chalk')

const url = process.cwd()



/**
 *
 * Write file and handle error
 *  
 * @param {string} file_path 
 * @param {string} temp 
 *
 */

function createFile(file_path, temp){
    fs.writeFile(file_path, temp, err => {
        if(err) {
            console.log(reset.red(`Cannot create ${red.underline(file_path.replace(url, ''))}\n`), err)
            return
        }
        console.log(reset.green('\t+ '), cyan.underline(file_path.replace(url, '')), green(' was created'))
    })
}



/**
 *
 * Create Component files with templates
 *  
 * @param {string[]} args -> arguments from process
 *
 */

function component (args) {

    /** Hadnling args  */
    const component = args[1]
    const params = args.filter((v, i) => i !== 0 && i !== 1)



    if (!component) {
        console.log(reset.red('\tInvalid name of component'))
        return
    }

    /** Handling 'in' component options */
    let sub_path = './'
    params.forEach( param => {
        if(param.match(/in=.{1,}/))
            sub_path = param.replace('in=', '')
    })

    const app_path = join(url, 'src', 'app', sub_path)



    /** Find valid folder */

    fs.readdir(app_path, err => {
        if (err) {
            console.log(reset.red('\tYou are in invalid folder or input folder doesnt exist\n', err))
            return
        }

        const { styles } = require(join(url, 'modular.json'))

        const component_upper = component.replace(/./, m => m.toUpperCase())
        const component_path = join(app_path, component_upper)
        const component_ts_path = join(component_path, `${component_upper}.component.tsx`)
        const component_css_path = join(component_path, `${component_upper}.${styles.use}`)

        /** Creating component */
        fs.mkdir(component_path, err => {
            if (err) {
                console.log(reset.red('\tCannot create component directory\n', err))
                return
            }

            const inludes_css = !params.includes('!css')

            const css_type = styles.use.match(/^(sass|scss)$/) ? styles.use : 'css'
            const ts_type = params.includes('functional') ? 'functional' : 'class'


            createFile(component_ts_path, template[ts_type](component_upper, inludes_css, css_type))

            if (inludes_css)
                createFile(component_css_path, template[css_type](component_upper))

        })


    })
}


module.exports = component