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

\t- ${cyan('$ modular pull <repo> [<name>] [-npm]')} ${gray(' -> Clone application from <repo> and install all packages into <name> folder')}
\t\t- ${cyan(`<repo> ${gray('-> SSH, HTTPS or username/project')}`)}
\t\t\t- ${cyan(`example: $ modular pull kasarda/modular newApplication`)}
\t\t\t- ${cyan(`example: $ modular pull https://github.com/kasarda/modular.git newApplication`)}
\t\t\t- ${cyan(`example: $ modular pull git@github.com:kasarda/modular.git newApplication`)}
\t- ${cyan('$ modular serve [-npm]')} ${gray(' -> Serving application')}
\t- ${cyan('$ modular build [-npm]')} ${gray(' -> Create production')}
\t- ${cyan('$ modular test [-npm]')} ${gray(' -> Run mocha testing')}
\t- ${cyan('$ modular install [-npm]')} ${gray(' -> Install packages')}
\t- ${cyan('$ modular -V')} ${gray(' -> Get version of CLI')}
\t- ${cyan('$ modular <other_options>')} ${gray(' -> Show documentation')}
\t ${gray(`Created by ${author.name}`)}
`)