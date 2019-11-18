const inquirer  = require('inquirer')
const chalk     = require('chalk')
const config    = require('../config.json')
const User      = require('../models/user')
const mongoose  = require('mongoose')

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })

inquirer.prompt([
    {type: 'list', name: 'selection', choices: [{name: "Add", value: "add", short: 'Add'}, {name: "List", value: "get", short: 'List'}, {name: 'Delete', value: 'del', short: 'Delete'}], message: 'Action to perform'}
]).then(answers => {
    switch(answers.selection) {
        case 'add':
            inquirer.prompt([
                {type: 'input', name: 'name', message: 'Name'},
                {type: 'input', name: 'mail', message: 'Mail'},
                {type: 'password', name: 'password', message: 'Password'}
            ]).then(answers => {
                let thisUser = new User(answers)
                thisUser.save((err, user) => {
                    if(err) {console.log(chalk.red(err.message)); process.exit(1)}
                    console.log(chalk.green('Successfully saved'))
                    process.exit(0)
                })
            })
            break;
        case 'get':
            User.find({}, (err, users) => {
                if(err) {console.log(chalk.red(err.message)); process.exit(1)}
                console.log(users)
                process.exit(0)
            })
            break;
        case 'del':
            break;
    }
})