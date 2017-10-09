#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const Init = require('./init')
const package = require('../package.json')
const { choose, executeCommand, support } = require('./util/cli')

const doc = require('./doc')
const manager = choose('yarn', 'npm')
program.version(package.version).usage('<keywords>').parse(process.argv)


if(!manager)
    console.log(chalk.reset.red('\tModular require npm or yarn'))
else if(!support('git')) 
    console.log(chalk.reset.red('\tModular require git'))
else if (!support('node'))
    console.log(chalk.reset.red('\tModular require node'))
else 
    switch (program.args[0]) {

        case 'init':
            Init(program.args[1] || 'modular').then(_ => console.log(doc))
        break

        case 'install':
            console.log(chalk.reset.cyan.underline('\Installing packages via ', manager))
            executeCommand(`${manager} install`)
        break

        case 'serve':
            console.log(chalk.reset.cyan.underline('\tServing Application'))
            executeCommand(`${manager} run serve`)
        break

        case 'build':
            console.log(chalk.reset.cyan.underline('\tBuild Application'))
            executeCommand(`${manager} run build`)
        break

        case 'test':
            console.log(chalk.reset.cyan.underline('\Testing Application'))
            executeCommand(`${manager} run test`)
        break

        case 'open':
            const editor = program.args[1] || 'code'
            console.log(chalk.reset.cyan.underline('\tOpening in ' + editor.replace(/./, m => m.toUpperCase())))
            executeCommand(`${editor} .`)
        break


        case 'component':
            require('./component')(program.args, program)
            break

        case 'version':
            console.log(chalk.reset.cyan('modular cli -> version', package.version))
        break

        default:
            console.log(doc)
    }





