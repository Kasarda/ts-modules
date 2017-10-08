#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const package = require('../package.json')
const build = require('./build')
const command = require('./manager')()

program.version(package.version).usage('<keywords>').parse(process.argv)



switch (program.args[0]) {

  case 'init':
    if (program.args[1]){
      build(program.args[1])
    }
    else
      console.log(chalk.red('\tPlease supply a name for your Modular app.')) 
  break
  
  case 'install':
    console.log(chalk.cyan.underline('\Installing packages via ', command))
    spawn(command, ['install'], { stdio: 'inherit' })
  break

  case 'serve': 
    console.log(chalk.cyan.underline('\tServing Application'))
    spawn(command, ['run', 'serve'], { stdio: 'inherit' })
  break
    
  
  case 'build':
    console.log(chalk.cyan.underline('\tBuild Application'))
    spawn(command, ['run', 'build'], { stdio: 'inherit' })
  break

  case 'test':
    console.log(chalk.cyan.underline('\Testing Application'))
    spawn(command, ['run', 'test'], { stdio: 'inherit' })
  break
  
  
  case 'open':
    const editor = program.args[1] || 'code'
    console.log(chalk.cyan.underline('\tOpening in ' + editor.replace(/./, m => m.toUpperCase())))
    spawn(editor, ['.'], { stdio: 'inherit' })
  break


  case 'component':
    require('./component')(program.args, program)
  break

  case 'version':
    console.log(chalk.cyan('modular cli -> version', package.version))
  break

  default : 

    console.log(`${chalk.reset()}----------------------------------------------------------
${chalk.cyan(`\tWelcome to Modular CLI \n\tversion ${package.version}`)}
----------------------------------------------------------

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
`)
}





