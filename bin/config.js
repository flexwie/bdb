const inquirer  = require('inquirer')
const figlet    = require('figlet')
const chalk     = require('chalk')
const fs        = require('fs')

//console.log(figlet('bdb', {horizontalLayout: 'full'}))

inquirer.prompt([
    {type: 'number', name: 'port', message: 'Port to run'},
    {type: 'input', name: 'title', message: 'Instance title'},
    {type: 'input', name: 'mongodb', message: 'MongoDB Connection String'},
    {type: 'input', name: 'elastic_index_name', message: 'Elasticsearch Index Name'},
    {type: 'input', name: 'elastic_host', message: 'Elasticsearch Host'},
    {type: 'input', name: 'elastic_auth', message: 'Elasticsearch Authentication'},
    {type: 'password', name: 'cookie_secret', message: 'Session Secret'}
]).then(answers => {
    try {
        fs.writeFileSync('config.json', JSON.stringify(answers))
        console.log(chalk.green('Configuration file successfully saved'))    
    } catch (error) {
        console.log(chalk.red(error.message))
    }
})