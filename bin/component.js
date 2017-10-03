const fs = require('fs')
const path = require('path')
const template = require('./template')
const chalk = require('chalk')

const url = process.cwd()


function createFile(p, temp, component_path){
    fs.writeFile(p, temp, err => {
        if(err) {
            console.log(chalk.red(`Cannot create ${chalk.red.underline(component_path.replace(url, ''))}`), err)
            return
        }

        console.log(chalk.green('\t+ '), chalk.cyan.underline(component_path.replace(url, '')), chalk.green(' was created'))
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
                    console.log(chalk.red('\tCannot create component directory'))
                    console.log(err)
                    return
                }

                const inludes_css = !args.includes('!css') 

                createFile(component_ts_path, template.typescript(component_upper, inludes_css), component_ts_path)

                if ( inludes_css )
                    createFile(component_css_path, template.css(component_upper), component_css_path)
            })
        }




        /** Find valid folder */

        fs.readdir(app_path, err => {
            if (err) 
                console.log(chalk.red('\tYou are in invalid folder or input folder doesnt exist'))
            else
                createComponent()
        })
    }
    else 
        console.log(chalk.red('\tInvalid name of component'))
}



module.exports = component