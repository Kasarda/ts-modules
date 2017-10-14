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

\t- ${cyan('$ modular new ?[<name>]')} ${gray(' -> Clone modular application and install all packages into <name> folder')}
\t- ${cyan('$ modular pull <repo> ?[<name>]')} ${gray(' -> Clone application from <repo> and install all packages into <name> folder')}
\t\t- ${cyan(`<repo> ${gray('-> SSH, HTTPS or username/project')}`)}
\t\t\t- ${cyan(`example: $ modular pull kasarda/modular newApplication`)}
\t\t\t- ${cyan(`example: $ modular pull https://github.com/kasarda/modular.git newApplication`)}
\t\t\t- ${cyan(`example: $ modular pull git@github.com:kasarda/modular.git newApplication`)}
\t- ${cyan('$ modular serve')} ${gray(' -> Serving application')}
\t- ${cyan('$ modular build')} ${gray(' -> Create production')}
\t- ${cyan('$ modular test')} ${gray(' -> Run mocha testing')}
\t- ${cyan('$ modular -V')} ${gray(' -> Get version of CLI')}
\t- ${cyan('$ modular component <name> ?[<options>]')} ${gray(' -> Generate react component with css')}
\t\t-  ${cyan('?[<options>]')}
\t\t\t- ${cyan('!css')} ${gray(' -> Create component without css file')}
\t\t\t- ${cyan('functional')} ${gray(' -> Create component using function not class')}
\t\t\t- ${cyan('in=<sup_component>')} ${gray(' -> Create sub component')}
\t\t\t ${cyan('example: $ modular component phone in=contact !css')}
\t\t\t ${cyan('example: $ modular component street in=contact/address functional')}
\t- ${cyan('$ modular install')} ${gray(' -> Install packages')}
\t- ${cyan('$ modular <other_options>')} ${gray(' -> Show documentation')}

\t ${gray(`Created by ${author.name}`)}
`)