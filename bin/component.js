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
const path = require('path')
const template = require('./template')
const chalk = require('chalk')

const url = process.cwd()

function createFile(p, temp){
    fs.writeFile(p, temp, err => {
        if(err) {
            console.log(chalk.reset.red(`Cannot create ${chalk.red.underline(p.replace(url, ''))}`), err)
            return
        }

        console.log(chalk.reset.green('\t+ '), chalk.cyan.underline(p.replace(url, '')), chalk.green(' was created'))
    })
}


function component (args) {
    
    let component = args[1]
    if (component) {

        let sub_path = './'
        args.forEach( arg => {
            if(arg.match(/in=.{1,}/)){
                sub_path = arg.replace('in=', '')
            }
        })
        const component_upper = component.replace(/./, m => m.toUpperCase())
        const app_path = path.join(url, 'src', 'app', sub_path)
        const component_path = path.join(app_path, component_upper)
        const component_ts_path = path.join(component_path, `${component_upper}.component.tsx`)
        const component_css_path = path.join(component_path, `${component_upper}.sass`)


        /** Create component */

        function createComponent() {

            fs.mkdir(component_path, err => {
                if (err) {
                    console.log(chalk.reset.red('\tCannot create component directory'))
                    console.log(err)
                    return
                }

                const inludes_css = !args.includes('!css') 

                createFile(component_ts_path, template.typescript(component_upper, inludes_css))

                if ( inludes_css )
                    createFile(component_css_path, template.css(component_upper))
            })
        }


        /** Find valid folder */

        fs.readdir(app_path, err => {
            if (err) 
                console.log(chalk.reset.red('\tYou are in invalid folder or input folder doesnt exist'))
            else
                createComponent()
        })
    }
    else 
        console.log(chalk.reset.red('\tInvalid name of component'))
}



module.exports = component