const fs = require('fs')
const path = require('path')
const config = require('./config.json')
const { executeCommand } = require('./cli')
const { reset } = require('chalk')


const updateConfig = obj => {
    const configFile = path.join(__dirname, 'config.json')
    const newConfig = JSON.stringify(config, null, 2)

    return new Promise((resolve, reject) => {
        fs.writeFile(configFile, newConfig, err => {
            if (err) {
                reject(err)
                console.log(reset.red('Cannot update config file'), reset.gray(err))
                return false
            }

            resolve(obj)
        })
    })

}

const customCommand = (name, value) => {
    const msg = config.commands[name] ? `You updated command ${name}` : `You created command ${name}`
    config.commands[name] = value
    updateConfig(config).then(_ => console.log(reset.cyan(msg)))
}

const removeCustomCommand = name => {
    let msg = ''

    if(name === '*') {
        config.commands = {}
        msg = 'You removed all commands'
    }
    else if (config.commands[name]) {
        delete config.commands[name]
        msg = `You removed command ${name}`
    }
    else {
        msg = `Command ${name} doesn't exists`
    }

    updateConfig(config).then(_ => console.log(reset.cyan(msg)))
}



const executeCustomCommand = command => {
    if (config.commands[command])
        executeCommand(config.commands[command]).catch(err => {
            console.log(reset.red(`Cannot execute ${command} command`))
        })

    else
        console.log(reset.cyan(`Command ${command} is not created yet`))
}



module.exports = {
    customCommand,
    removeCustomCommand,
    executeCustomCommand
}