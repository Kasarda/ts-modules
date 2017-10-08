#!/usr/bin/env node

const chalk = require('chalk')
const package = require('../package.json')


module.exports = chalk.reset(`----------------------------------------------------------
${chalk.cyan(`\tWelcome to Modular CLI \n\tversion ${package.version}`)}
----------------------------------------------------------

\t - ${chalk.cyan('$ modular init ?[<name>]')} ${chalk.gray(' -> Clone application and install all packages into <name> folder')}
\t - ${chalk.cyan('$ modular open ?[<editor>]')} ${chalk.gray(' -> Open actual directive in editor, default is vs code')}
\t - ${chalk.cyan('$ modular serve')} ${chalk.gray(' -> Serving application')}
\t - ${chalk.cyan('$ modular build')} ${chalk.gray(' -> Create production')}
\t - ${chalk.cyan('$ modular test')} ${chalk.gray(' -> Run mocha testing')}
\t - ${chalk.cyan('$ modular version')} ${chalk.gray(' -> Get version of CLI')}
\t - ${chalk.cyan('$ modular component <name> ?[<options>]')} ${chalk.gray(' -> Generate react component with css')}
\t\t -  ${chalk.cyan('?[<options>]')}
\t\t\t - ${chalk.cyan('!css')} ${chalk.gray(' -> Generated component will be without css')}
\t\t\t - ${chalk.cyan('in=<path>')} ${chalk.gray(' -> Generated component will be inside this path, default is ./')}
\t\t\t ${chalk.cyan('example: $ modular component phone in=contact !css')}
\t - ${chalk.cyan('$ modular install')} ${chalk.gray(' -> Install packages')}
\t - ${chalk.cyan('$ modular <other_options>')} ${chalk.gray(' -> Show documentation')}

\t ${chalk.gray('Created by Filip Kasarda')}
`)