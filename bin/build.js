#!/usr/bin/env node

require('shelljs/global')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const manager = require('./manager')()
const package = require('../package.json')
const repo = 'https://github.com/fazulkovy/modular.git'


function executeCommand(command){

  const commands = command.split(' ')
  const options = commands.filter((v,i) => i !== 0)

  return new Promise((resolve, reject) => {

    const child = spawn(commands[0], options, { stdio: 'inherit' })

    child.on('close', code => {
      if (code !== 0) {
        reject({command})
        return
      }
      resolve()
    })

  })

}



function getFilesList(dir, filelist) {
  files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('dist'))
      filelist = getFilesList(path.join(dir, file), filelist)
    else
      filelist.push(path.join(dir, file))
  })
  return filelist
}





module.exports = appName => {

  const help_log = `${chalk.reset()}----------------------------------------------------------
${chalk.cyan(`\tWelcome to Modular CLI \n\tversion ${package.version}`)}
----------------------------------------------------------

\t - ${chalk.cyan(`cd into new created application ${chalk.underline(appName)}`)}

\t - ${chalk.cyan('$ modular init <folder>')} ${chalk.gray(' -> Clone application and install all packages into <folder>')}
\t - ${chalk.cyan('$ modular open ?[<editor>]')} ${chalk.gray(' -> Open actual directive in editor, default is vs code')}
\t - ${chalk.cyan('$ modular serve')} ${chalk.gray(' -> Serving application')}
\t - ${chalk.cyan('$ modular build')} ${chalk.gray(' -> Create production')}
\t - ${chalk.cyan('$ modular test')} ${chalk.gray(' -> Run mocha testing')}
\t - ${chalk.cyan('$ modular version')} ${chalk.gray(' -> Get version of CLI')}
\t - ${chalk.cyan('$ modular component <name> ?[<options>]')} ${chalk.gray(' -> Generate react component with css')}
\t\t -  ${chalk.cyan('?[<options>]')}
\t\t\t - ${chalk.cyan('!css')} ${chalk.gray(' -> Generated component will be without css')}
\t\t\t - ${chalk.cyan('in=<path>')} ${chalk.gray(' -> Generated component will be inside this path, default is ./')}
\t\t\t ${chalk.cyan('example: $ modular component phone in=contact !css')}
\t - ${chalk.cyan('$ modular install')} ${chalk.gray(' -> Install packages')}
\t - ${chalk.cyan('$ modular <other_options>')} ${chalk.gray(' -> Show documentation')}

\t ${chalk.gray('Created by Filip Kasarda')}${chalk.reset()}
`



  console.log(chalk.cyan.underline('\t Application is creating'))

  executeCommand(`git clone ${repo} ${appName}`).then(() => {

    const app_dir = path.join(process.cwd(), appName)
    const list = getFilesList(app_dir, [])

    list.forEach(file => console.log(chalk.green(`\t+ ${file.replace(app_dir, '')}`)))

    console.log(chalk.cyan.underline('\n\t Installing packages ...'))

    cd(appName)
    executeCommand(`${manager} install`).then(() => {
      console.log(help_log)
    }).catch(err => console.log(chalk.red('An unexpected error occurred\n'), err))

  })


}
