#!/usr/bin/env node

require('shelljs/global')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const command = require('./manager')()


const installPackages = () => {
  console.log(chalk.white.bold('Installing Packages'))
  return new Promise((resolve, reject) => {

    let args = ['install']


    
    const child = spawn(command, args, { stdio: 'inherit' })

    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        })
        return
      }
      resolve()
    })
  })
}

const build = (appName) => {
  cp('-r', __dirname + '/../src/.', appName)

  console.log(`----------------------------------------------------------
${chalk.inverse('\tWelcome to Modular CLI')}
----------------------------------------------------------
${chalk.cyan.underline('\t Application is creating')}
`)


  const createFiles = new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../src'), (err, files) => {
      if (err) {
        reject(err)
        return
      }
      files.forEach(file => console.log(chalk.green('\t+ ' + file)))
      resolve()
    })
  })



  createFiles.then(_ => {
    console.log(chalk.cyan.underline('\n\t Installing packages ...'))
    cd(appName)
    installPackages().then(() => {
 

      console.log(`
\t${chalk.cyan.underline('Let\'s get started')}
\t${chalk.green('Step 1: cd into the newly created ' + chalk.cyan.underline(appName) + ' directory')}
\t${chalk.green('Step 2: run ' + chalk.cyan.underline('$ modular open <editor>'))}
\t${chalk.green('Step 3: run ' + chalk.cyan.underline('$ modular serve'))}
\t${chalk.green('Step 4: run ' + chalk.cyan.underline('$ modular build'))}
\t${chalk.green('Step 5: run ' + chalk.cyan.underline('$ modular component <name_of_component> <options>'))}
        options: 
          !css -> not css 
          in=<path_in_app> -> parent of new component e.g. in=about 
\t${chalk.green('Step 6: Enjoy')}
----------------------------------------------------------`)

    })
      .catch(error => {
        console.log(chalk.red('An unexpected error occurred'))
        console.log(chalk.red(error))
      })

  })
    .catch(err => { throw err })


}

module.exports = build