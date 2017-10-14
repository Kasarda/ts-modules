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
const { choose, executeCommand, getFilesList } = require('./util/cli')
const doc = require('./doc')

const manager = choose('yarn', 'npm')



module.exports = async (appName, repo) => {
  try{

    /**
     * 
     * Clone from repo
     * 
     */
    console.log(reset.cyan.underline('\t Application is creating'))
    await executeCommand(`git clone ${repo} ${appName}`)



    /**
     * 
     * Get list of new files
     * 
     */
    const app_dir = join(process.cwd(), appName)
    const list = getFilesList(app_dir, ['node_modules', '\.git'])
    list.forEach(file => console.log(reset.green(`\t+ ${file.replace(app_dir, '')}`)))

    /**
     * 
     * Install packages
     * 
     */
    console.log(reset.cyan.underline('\n\t Installing packages ...'))
    shell.cd(appName)
    await executeCommand(`${manager} install`)
    
    console.log(doc)
  }
  catch(err){
    console.log(reset.red(`Something is wrong\n`), err)
  }

  return appName
}
