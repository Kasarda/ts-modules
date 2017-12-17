#!/usr/bin/env node

/**! @license
  * init.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

const shell = require('shelljs')
const { join } = require('path')
const { reset } = require('chalk')
const { choose, executeCommand, getFilesList, support } = require('./cli')
const doc = require('./doc')

module.exports = async (appName, repo, rawArgs) => {
  const manager = rawArgs[rawArgs.length - 1] === '-yarn' ? 'yarn' : 'npm'

  if (!support('git')) {
    console.log(reset.red(`\tModular require ${reset.red.underline('Git')}\nyou can install git from https://git-scm.com/`))
    return
  }
  else if(manager === 'yarn' && !support('yarn')) {
    console.log(reset.red(`\tYarn is not installed in your machine, please run ${reset.red.underline('$ npm i -g yarn')}`))
    return
  }
  try {

    /**
     *
     * Clone from repo
     *
     */
    console.log(reset.cyan.underline('\t Application is creating'))
    await executeCommand(appName ? `git clone ${repo} ${appName}` : `git clone ${repo}`)

    let name
    try {
      name = appName ? appname : repo.replace('https://github.com/', '').replace('git@github.com:', '').match(/\/.{1,}\.git$/)[0].replace('.git', '').replace(/^\//, '')
    }
    catch(err) {
      console.log(reset.red(`Something is wrong in name of the project\n`), err)
    }


    /**
     *
     * Get list of new files
     *
     */
    const app_dir = join(process.cwd(), name)
    const list = getFilesList(app_dir, ['node_modules', '\.git'])
    list.forEach(file => console.log(reset.green(`\t+ ${file.replace(app_dir, '')}`)))

    /**
     *
     * Install packages
     *
     */
    console.log(reset.cyan.underline('\n\t Installing packages ...'))
    shell.cd(name)
    await executeCommand(`${manager} install`)

    console.log(doc)
    console.log(`${reset.cyan(`\tcd into ${reset.cyan.underline(name)}`)}`)
  }
  catch (err) {
    console.log(reset.red(`Something is wrong\n`), err)
  }

  return 0
}
