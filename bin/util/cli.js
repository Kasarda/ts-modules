#!/usr/bin/env node

const commandExists = require('command-exists').sync
const spawn = require('cross-spawn')
const fs = require('fs')
const path = require('path')


let filelist = []

const cli = {
  to(promise) {
    return promise.then(data => [null, data]).catch(err => [err])
  },

  support(command) {
    return commandExists(command)
  },

  choose(...commands) {
    let supported_command = null

    commands.forEach(command => {
      if (!supported_command && commandExists(command))
        supported_command = command
    })

    return supported_command
  },


  executeCommand(command) {

    const commands = command.split(' ')
    const options = commands.filter((v, i) => i !== 0)

    return new Promise((resolve, reject) => {

      if (commandExists(commands[0])) {
        const child = spawn(commands[0], options, { stdio: 'inherit' })

        child.on('close', code => {
          if (code !== 0) {
            reject({ command })
            return
          }
          resolve()
        })
      }
      else reject()


    })

  },

  getFilesList(dir, exludes = []) {
    const files = fs.readdirSync(dir)
    filelist = filelist

    let exlude_string = '\.git'
    exludes.forEach((exlude, index) => {
      if (index === 0)
        exlude_string = exlude

      else
        exlude_string = exlude_string + '|' + exlude
    })

    files.forEach(file => {
      if (fs.statSync(path.join(dir, file)).isDirectory() && !file.match(new RegExp(exlude_string, 'i')))
        filelist = cli.getFilesList(path.join(dir, file), exludes)
      else
        filelist.push(path.join(dir, file))
    })

    return filelist
  }
}

module.exports = cli






