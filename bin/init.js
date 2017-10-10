#!/usr/bin/env node

const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { choose, executeCommand, getFilesList } = require('./util/cli')

const manager = choose('yarn', 'npm')
const repo = 'https://github.com/Kasarda/modular.git'



module.exports = async appName => {
  let err
  /**
   * 
   * Clone from repo
   * 
   */
  console.log(chalk.reset.cyan.underline('\t Application is creating'))
  await executeCommand(`git clone ${repo} ${appName}`)



  /**
   * 
   * Get list of new files
   * 
   */
  const app_dir = path.join(process.cwd(), appName)
  const list = getFilesList(app_dir, ['node_modules', '\.git'])
  list.forEach(file => console.log(chalk.reset.green(`\t+ ${file.replace(app_dir, '')}`)))

  /**
   * 
   * Install packages
   * 
   */
  console.log(chalk.reset.cyan.underline('\n\t Installing packages ...'))
  shell.cd(appName)
  await executeCommand(`${manager} install`)

  return appName
}
