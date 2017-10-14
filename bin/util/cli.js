#!/usr/bin/env node

/**! @license
  * cli.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */

const commandExists = require('command-exists').sync
const spawn = require('cross-spawn')
const { readdirSync, statSync } = require('fs')
const { join } = require('path')


let filelist = []


const cli = {
  
  /**
   * 
   * @method support
   * @param {string} command 
   * @desc
   *  Check if pc support specific command such as node, npm or git ...
   * 
   */
  support(command) {
    return commandExists(command)
  },

  /**
   * 
   * @method choose
   * @param {string[]} commands
   * @desc
   *  Choose first command from array which is supported by pc
   * e.g. choose('yarn', 'npm') -> if yarn is supported then return yarn 
   *                               if is not and npm is supported then npm will be returned ...
   *                               Otherwise return null
   */
  choose(...commands) {
    let supported_command = null

    commands.forEach(command => {
      if (!supported_command && commandExists(command))
        supported_command = command
    })

    return supported_command
  },



  /**
   * 
   * @method executeCommand
   * @param {string} command -> command is with arguments
   * @desc
   *  Execute command and return promise 
   * e.g. executeCommand('git clone https://github.com/user/project.git').then(() => console.log('done')).catch(err => err)
   */
  executeCommand(command) {

    const commands = command.split(' ')
    const options = commands.filter((v, i) => i !== 0)

    return new Promise((resolve, reject) => {

      if (!commandExists(commands[0])){
        reject()
        return
      }

      const child = spawn(commands[0], options, { stdio: 'inherit' })

      child.on('close', code => {
        if (code !== 0) {
          reject({ command })
          return
        }
        resolve()
      })

    })

  },


  /**
   * 
   * @method getFilesList
   * @param {string} dir
   * @param {string[]} exludes -> array of ignored folders
   * @desc
   *  Return list of all files inside dir
   */

  getFilesList(dir, exludes = []) {
    const files = readdirSync(dir)
    filelist = filelist

    let exlude_string = '\.git'
    exludes.forEach((exlude, index) => {
      if (!index === 0){
        exlude_string = exlude_string + '|' + exlude
        return
      }

      exlude_string = exlude

    })

    files.forEach(file => {
      const isDir = statSync(join(dir, file)).isDirectory()
      const is_not_exludes = !file.match(new RegExp(exlude_string, 'i'))
      
      if (!(isDir && is_not_exludes)) {
        filelist.push(join(dir, file))
        return
      }
      
      filelist = cli.getFilesList(join(dir, file), exludes)
    })

    return filelist
  }
}

module.exports = cli






