require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const cookie = require('cookie-parser')
const morgan = require('morgan')
const flash = require('express-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const mongtastic = require('mongoosastic')
const elastic = require('elasticsearch')

// Connect to mongoose and elastic
mongoose
	.connect(
		`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:27017/bdb?authSource=admin`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoReconnect: true,
			reconnectTries: 5,
		}
	)
	.catch(err => process.exit(1))
let esclient = new elastic.Client({ host: 'localhost:9200' })

const resolution = require('./models/resolution')
const user = require('./models/user')

// Add mongtastic hydrate for querying
resolution.plugin(mongtastic, {
	esClient: esclient,
	hydrate: false,
	hydrateOptions: null,
})

const Resolution = mongoose.model('Resolution', resolution)

// Route files
const start = require('./routes/public')(Resolution)
const admin = require('./routes/private')(Resolution)

var app = express()

app.set('view engine', 'pug')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookie(process.env.COOKIE_SECRET))
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(flash())
app.use(express.static('public'))
app.locals.md = require('node-markdown').Markdown
app.locals.moment = require('moment')

app.use(morgan(':method :url :status - :response-time ms'))

app.use(function (req, res, next) {
	res.locals.session = req.session
	next()
})

app.use('/', start)
app.use('/admin', admin)

app.listen(8080)
