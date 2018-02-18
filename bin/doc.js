#!/usr/bin/env node

/**! @license
  * doc.js
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */
const { reset, cyan, gray } = require('chalk')
const { version, author } = require('../package.json')


module.exports = reset(`----------------------------------------------------------
${cyan(`\tWelcome to Modular CLI \n\tversion ${version}`)}
----------------------------------------------------------

\t- ${cyan('$ ml pull <repo> [<name>] [-npm]')} ${gray(' -> Clone application from <repo> and install all packages into <name> folder')}
\t\t- ${cyan(`<repo> ${gray('-> SSH, HTTPS or username/project')}`)}
\t\t\t- ${cyan(`example: $ ml pull kasarda/modular newApplication`)}
\t\t\t- ${cyan(`example: $ ml pull https://github.com/kasarda/modular.git newApplication`)}
\t\t\t- ${cyan(`example: $ ml pull git@github.com:kasarda/modular.git newApplication`)}
\t- ${cyan('$ ml serve [-npm]')} ${gray(' -> Serving application')}
\t- ${cyan('$ ml build [-npm]')} ${gray(' -> Create production')}
\t- ${cyan('$ ml test [-npm]')} ${gray(' -> Run mocha testing')}
\t- ${cyan('$ ml install [-npm]')} ${gray(' -> Install packages')}
\t- ${cyan('$ ml config')} ${gray(' -> Get JSON of config')}
\t- ${cyan('$ ml -V')} ${gray(' -> Get version of CLI')}
\t- ${cyan('$ ml <other_options>')} ${gray(' -> Show documentation')}

\t- ${cyan('Custom Commands')}
\t\t- ${cyan('$ ml $name "echo Hello World"')} ${gray(' -> create command name with value')}
\t\t- ${cyan('$ ml $name')} ${gray(' -> execute command name')}
\t\t- ${cyan('Hello World')} ${gray(' -> Output')}
\t\t- ${cyan('$ ml $name -')} ${gray(' -> remove command')}
\t\t- ${cyan('$ ml $* -')} ${gray(' -> remove all commands')}

\t ${gray(`Created by ${author.name}`)}
`)