#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const package = require('../package.json')
const build = require('./build')
const command = require('./shouldUseYarn')()

program.version(package.version).usage('<keywords>').parse(process.argv)


switch (program.args[0]) {
  
  
  case 'init':
    if (program.args[1])
      build(program.args[1])
    else
      console.log(chalk.red('\tPlease supply a name for your Modular app.')) 
  break
  
  
  
  case 'serve': 
    console.log(chalk.cyan.underline('\tServing Application'))
    spawn(command, ['serve'], { stdio: 'inherit' })
  break

  
  
  case 'build':
    console.log(chalk.cyan.underline('\tBuild Application'))
    spawn(command, ['build'], { stdio: 'inherit' })
  break

  
  
  case 'open':
    const editor = program.args[1] || 'code'
    console.log(chalk.cyan.underline('\tOpening in ' + editor.replace(/./, m => m.toUpperCase())))
    spawn(editor, ['.'], { stdio: 'inherit' })
  break


  case 'component':
    require('./component')(program.args, program)
  break


  case 'log': 
    console.log(package.version)
  break
}





