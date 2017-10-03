#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const template = require('./component.template')
const modular = require(`${process.cwd()}/modular.json`)
const package = require(`${process.cwd()}/package.json`)
const css_ext = modular.styles.use || 'css'
const { exec } = require('child_process')

const red = '\x1b[31m'
const green = '\x1b[32m'
const blue = '\x1b[34m'
const reset = '\x1b[0m'
const underline = '\x1b[4m'
const bright = '\x1b[1m'
const cyan = '\x1b[36m'


function error(err, msg) {
    if(err) {
        console.log(red, `\t- ${msg}`, reset)
        console.log(bright, err, reset)
    }
}


function createFile(new_path, template, component, type){
    const comp = type === 'ts' ? `/app/${component}/${component}.component.tsx` : `/app/${component}/${component}.${css_ext}`
    fs.writeFile(new_path, template, err => {
        error(err, `Cannot create ${underline + comp + reset + red} component`)
        if (!err)
            console.log(green, `\t+ ${underline + comp + reset + green} was created`, reset)


    })
}




const args = process.argv
const app_url = path.join(process.cwd(), '/src/app')


args.forEach((arg, index) => {
    if(arg === 'component') {
        const component_name = args[index+1]
        const component_name_upper = component_name.replace(/./, m => m.toUpperCase())
        const new_component_dir = path.join(app_url, `${component_name}`)
        const new_component_file = path.join(new_component_dir, `${component_name}.component.tsx`)
        const new_css_file = path.join(new_component_dir, `${component_name}.${css_ext}`)


        fs.mkdir(new_component_dir, err => {
            error(err, `Cannot create direction for ${underline + component_name + reset + red} component`)
            if(!err) {

                const no_css_flag = args.includes('!css')
                const no_update_flag = args.includes('!update')

                const ts_temp = template('ts', component_name, css_ext, no_css_flag)
                createFile(new_component_file, ts_temp, component_name, 'ts')
                
                if (!no_css_flag) {
                    const css_temp = template('css', component_name, css_ext)
                    createFile(new_css_file, css_temp, component_name, 'css')
                }


                if (!no_update_flag) {
                    const app_path = path.join(process.cwd(), '/src/app/App.component.tsx')
                    fs.readFile(app_path, (err, data) => {
                        error(err, `Cannot read ${underline}/app/App.component.tsx${reset + red}`)
                        if (!err) {
                            const import_component = `import ${component_name_upper} from './${component_name}/${component_name}.component'
`
                            const temp = data.toString()
                            const new_temp = import_component + temp
                            const render_temp = new_temp.match(/export .{0,} class App extends Component[\s\S]*/)[0] || ''
                                .match(/render.{1,}[\s\S]*/)[0] || ''
                                    .match(/<div id="app">[\s\S]*/)[0] || ''
                                        .match(/[\s\S]*<\/div>/)[0] || ''

                            const new_render_temp = new_temp.replace(render_temp, render_temp.replace(/<\/div>/, m => `\t<${component_name_upper} />\n` + `\t\t\t${m}`))

                            fs.writeFile(app_path, new_render_temp, err => {
                                error(err, `cannot update${underline}/app/App.component.tsx${reset + red}`)
                                if(!err)
                                    console.log(`\t${green + underline}+ /app/App.component.tsx${reset + green} was updated`, reset)
                            
                            })
                        }
                    })
                }

            }
        })


    
    }

    else if(arg === 'help') {
        console.log(`
${blue}
__________________________________

\tModular CLI
\t${reset + bright + package.author.name + reset + blue}
\t${reset + bright + package.author.email + reset + blue}
__________________________________
${reset + green}
 1. Creating component ${reset}
    ${bright}$${reset} modular component ${blue}<name_of_component> <flags>${reset}
        ${blue}flags:${reset}
            ${blue + underline}!update${reset} -> App.component.tsx will be not updated
            ${blue + underline}!css${reset}    -> component will be without css
 ${green}2. Build${reset}
    ${bright}$${reset} modular build
 ${green}3. Serve${reset}
    ${bright}$${reset} modular serve
 ${green}4. Install${reset}
    ${bright}$${reset} modular install
 ${green}5. Documentation${reset}
    ${bright}$${reset} modular help
            `)
    }

    else if (arg === 'build'){
        console.log(green, 'build...', reset)

        exec('npm run build', (err, out, stderr) => {
            error((err), 'Cannot build project')
            if (!err) {
                if(stderr) 
                    error(stderr, 'Cannot build project')
                else
                    console.log(cyan, out, reset)
            }
        })

    }
    else if (arg === 'serve') {
        console.log(green, `Listening on localhost:${modular.port}`, reset)

        exec('npm run serve', (err, out, stderr) => {
            error((err), 'Cannot serve project')
            if (!err) {
                if (stderr)
                    error(stderr, 'Cannot serve project')
                else
                    console.log(cyan, out, reset)
            }
        })

    }

    else if (arg === 'install') {
        console.log(blue, 'Dependencies', reset)
        for (const dependency in package.dependencies)
            console.log(cyan, `${dependency} -> ${package.dependencies[dependency]}`, reset)
        
        console.log(blue, 'Dev Dependencies', reset)
        for (const dependency in package.devDependencies)
            console.log(cyan, `${dependency} -> ${package.devDependencies[dependency]}`, reset)

        console.log(green, `Installing packages...`, reset)

        exec('npm install', (err, out, stderr) => {
            error((err), 'Cannot install packages')
            if (!err) {
                if (stderr)
                    error(stderr, 'Cannot install packages')
                else
                    console.log(cyan, out, reset)
            }
        })

    }
  

})

