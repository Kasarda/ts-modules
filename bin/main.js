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
const { choose, executeCommand, support } = require('./util/cli')
const { version } = require('../package.json')
const Init = require('./init')
const doc = require('./doc')

program.version(version).usage('<keywords>').parse(process.argv)

const manager = choose('yarn', 'npm')
const starter_kit_repo = 'https://github.com/kasarda/modular.git'




if (!support('node'))
    console.log(reset.red('\tModular require node'))


    
else if (!manager)
    console.log(reset.red('\tModular require npm or yarn'))



else if (!support('git'))
    console.log(reset.red('\tModular require git'))



else 
    switch (program.args[0]) {


        /**
         * 
         * Create new modular project from modular repo and install dependencies
         * 
         */
        case 'new':
            Init(program.args[1] || 'modular', starter_kit_repo)
        break




        /**
         * 
         * Pull project from github to specific folder and install dependencies
         * 
         */
        case 'pull':
      
            const repo_arg = program.args[1]

            let repo = repo_arg

            const name_match = repo_arg.match(/(\/*[a-zA-Z0-9-_]{1,}(\.git)?)$/)
            const name = name_match ? name_match[0].replace(/^\//, '').replace(/\.git$/, '') : 'modular'

            if ( !repo_arg.includes('https://') && !repo_arg.includes('git@github.com') )
                repo = `https://github.com/${repo_arg}.git`
            
            Init(program.args[2] || name, repo)
        break




        /**
         * 
         * Install dependencies
         * 
         */
        case 'install':
            console.log(reset.cyan.underline('\Installing packages via', manager))
            executeCommand(`${manager} install`)
        break




        /**
         * 
         * NPM or Yarn commands
         * 
         */
        case 'serve':
        case 'build':
        case 'test':
            console.log(reset.cyan.underline(`\t${program.args[0]} Application`))
            executeCommand(`${manager} run ${program.args[0]}`)
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
         * Get doc of cli
         * 
         */
        default:
            console.log(doc)
    }





