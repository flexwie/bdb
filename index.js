const express     = require('express')
const low         = require('lowdb')
const bodyparser  = require('body-parser')
const cookie      = require('cookie-parser')
const morgan      = require('morgan')
const flash       = require('express-flash')
const session     = require('express-session')
const jsonval     = require('jsonschema').validate
const f_sync      = require('lowdb/adapters/FileSync')

const resolution_schema = {
  "id": "/Resolution",
  "type": "object",
  "properties": {
    "id": {"type": "string"},
    "signature": {"type": "string"},
    "title": {"type": "string"},
    "text": {"type": "string"},
    "date": {"type": "date"},
    "chamber": {"type": "string"},
    "applicant": {"type": "string"},
    "result": {"type": "string"}
  },
  "required": ["id", "title", "text", "date", "applicant"]
}

const adapter = new f_sync('./db/dev.db.json')
const db      = low(adapter)

db._.mixin({
  createNew: (obj, post) => {
    var result = jsonval(post, resolution_schema)
    if(result.valid) {
      console.log(jsonval(post, resolution_schema))
      return obj.resolutions.push(post)
    } else {
      return false
    }
  }
})
db.defaults({ resolutions: [], user: [] }).write()

// Route files
const start       = require('./routes/start')(db)
const admin       = require('./routes/admin')(db)
const sso         = require('./routes/sso')

var app = express()

app.set('view engine', 'pug')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookie('secret'))
app.use(session({secret: "Shh, its a secret!"}))
app.use(flash())
app.use(express.static('public'))
app.locals.md = require('node-markdown').Markdown
app.use(morgan(':method :url :status - :response-time ms'))

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
})

app.use('/', start)
app.use('/new', admin)
app.use('/sso', sso)

app.listen(4545)
