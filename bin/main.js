#!/usr/bin/env node

/**! @license
  * main.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

const program = require('commander')
const { reset } = require('chalk')
const { choose, executeCommand, support } = require('./cli')
const { version } = require('../package.json')
const Init = require('./init')
const doc = require('./doc')

program.version(version).usage('<keywords>').parse(process.argv)

const manager = choose('yarn', 'npm')
const starter_kit_repo = 'https://github.com/kasarda/modular.git'

const use_manager = support('yarn') && program.rawArgs[program.rawArgs.length-1] === '-yarn' ? 'yarn' : 'npm'


if (!support('node'))
    console.log(reset.red('\tModular require Node'))



else if (!manager)
    console.log(reset.red('\tModular require NPM or Yarn'))


else
    switch (program.args[0]) {


        /**
         *
         * Create new modular project from modular repo and install dependencies
         *
         */
        case 'new':
            Init(program.args[1] || 'modular', starter_kit_repo, program.rawArgs)
            break




        /**
         *
         * Pull project from github to specific folder and install dependencies
         *
         */
        case 'pull':
            const repo_arg = program.args[1]

            let repo = repo_arg

            if (!repo_arg.includes('https://') && !repo_arg.includes('git@'))
                repo = `https://github.com/${repo_arg}.git`

            Init(program.args[2], repo, program.rawArgs)
            break




        /**
         *
         * Install dependencies
         *
         */
        case 'install':
            console.log(reset.cyan.underline('\Installing packages via', use_manager))
            executeCommand(`${use_manager} install`)
            break




        /**
         *
         * NPM or Yarn commands
         *
         */
        case 'serve':
        case 'build':
        case 'test':
            console.log(reset.cyan.underline(`\t${program.args[0].replace(/./, m => m.toUpperCase())} Application via ${use_manager}`))
            executeCommand(`${use_manager} run ${program.args[0]}`)
            break




        /**
         *
         * Generating React component
         *
         */
        case 'component':
            require('./component')(program.args)
            break



        /**
         *
         * Updating CLI
         *
         */
        case 'update':
            console.log(reset.cyan.underline(`\tUpdating ts-modules via ${use_manager}`))
            let install_global = use_manager === 'yarn' ? 'yarn global add' : 'npm i -g'
            executeCommand(`${install_global} ts-modules`)
            break
        case 'log':
            console.log(use_manager)
        break

        /**
         *
         * Get doc of cli
         *
         */
        default:
            console.log(doc)
    }





