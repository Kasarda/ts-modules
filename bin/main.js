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
const { customCommand, removeCustomCommand, executeCustomCommand } = require('./custom')
const doc = require('./doc')
const config = require('./config.json')

program.version(version).usage('<keywords>').parse(process.argv)

const manager = choose('yarn', 'npm')

const use_manager = support('yarn') && program.rawArgs[program.rawArgs.length-1] !== '-npm' ? 'yarn' : 'npm'


if (!support('node'))
    console.log(reset.red('\tModular require Node'))



else if (!manager)
    console.log(reset.red('\tModular require NPM or Yarn'))


else if (program.args[0] && program.args[0].includes('$')) {
    const name = program.args[0].replace(/^\$/, '')
    const value = program.args[1]

    if (!value)
        executeCustomCommand(name)

    else if (value === '-')
        removeCustomCommand(name)

    else if (value)
        customCommand(name, value)

}

else
    switch (program.args[0]) {


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

            Init(program.args[2], repo, program.rawArgs).catch(err => console.log(reset.red(`Cant initialize project correctly\n`), err))
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
        case 'start':
        case 'test':
            console.log(reset.cyan.underline(`\t${program.args[0].replace(/./, m => m.toUpperCase())} Application via ${use_manager}`))
            executeCommand(`${use_manager} run ${program.args[0]}`)
            break

        /**
         *
         * Get config object
         *
         */

        case 'config':
            console.log(reset.cyan(JSON.stringify(config, null, 2)))
            break


        /**
         *
         * Get doc of cli
         *
         */
        default:
            console.log(doc)
    }





