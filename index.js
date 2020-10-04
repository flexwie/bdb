const express     = require('express')
const bodyparser  = require('body-parser')
const cookie      = require('cookie-parser')
const morgan      = require('morgan')
const flash       = require('express-flash')
const session     = require('express-session')
const mongoose    = require('mongoose')
const mongtastic  = require('mongoosastic')
const config      = require('./config.json')
const elastic     = require('elasticsearch')

// Connect to mongoose and elastic
mongoose.connect(config.mongodb, { useNewUrlParser: true })
let esclient = new elastic.Client({host: config.elastic_host})

const resolution = require('./models/resolution')
const user = require('./models/user')

// Add mongtastic hydrate for querying
resolution.plugin(mongtastic, {
  index: config.elastic_index_name,
  esClient: esclient,
  hydrate: false,
  hydrateOptions: null
})

const Resolution = mongoose.model('Resolution', resolution)

// Route files
const start       = require('./routes/public')(Resolution)
const admin       = require('./routes/private')(Resolution)

var app = express()

app.set('view engine', 'pug')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookie(config.cookie_secret))
app.use(session({
  secret: config.cookie_secret,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(express.static('public'))
app.locals.md = require('node-markdown').Markdown
app.locals.moment = require('moment')

app.use(morgan(':method :url :status - :response-time ms'))

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
})

app.use('/', start)
app.use('/admin', admin)

app.listen(config.port)
