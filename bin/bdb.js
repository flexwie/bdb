const inquirer = require('inquirer')
const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs')
const listr = require('listr')
const { Observable } = require('rxjs')
const net = require('net')
const exec = require('execa')
const execa = require('execa')

//console.log(figlet('bdb', {horizontalLayout: 'full'}))

inquirer.prompt([
    { type: 'number', name: 'port', message: 'Port to run' },
    { type: 'input', name: 'mongodb', message: 'MongoDB Connection String' },
    { type: 'input', name: 'elastic_index_name', message: 'Elasticsearch Index Name' },
    { type: 'input', name: 'elastic_host', message: 'Elasticsearch Host' },
    { type: 'input', name: 'elastic_auth', message: 'Elasticsearch Authentication' },
    { type: 'password', name: 'cookie_secret', message: 'Session Secret' }
]).then(answers => {
    const tasks = new listr([
        {
            title: 'MongoDB',
            task: ctx => new Promise((resolve, reject) => {
                // check if mongodb is alright
                resolve()
            })
        },
        {
            title: 'Elastichsearch',
            task: ctx => new Observable((observer) => {
                observer.next('Testing connection')
                // check connection
                observer.next('Putting configuration')
                // set tokenizer function
                observer.complete()
            })
        },
        {
            title: 'Port',
            task: ctx => new Promise((resolve, reject) => {
                var server = net.createServer(function (socket) {
                    socket.write('Echo server\r\n')
                    socket.pipe(socket)
                })

                server.listen(answers.port, '127.0.0.1')
                server.on('error', function (e) {
                    reject(new Error("Port is already in use"))
                })
                server.on('listening', function (e) {
                    server.close()
                    resolve()
                })
            })
        },
        {
            title: "Writing config",
            task: ctx => new Promise((resolve, reject) => {
                try {
                    fs.writeFileSync('../config.json', JSON.stringify(answers))
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        },
        {
            title: 'Start server',
            task: ctx => {
                exec('npm', ['start'])
            }
        }
    ])

    tasks.run().catch(err => {
        chalk.red(err)
    })
})