module.exports = (db) => {
  const express = require('express')
  const shortid = require('shortid')
  const moment  = require('moment')
  var router    = express.Router()

  router.use((req, res, next) => {
    if(req.session.is_logged_in) {
      next()
    } else {
      req.flash('warning', 'Nicht eingeloggt')
      res.redirect('/login')
    }
  })

  router.get('/', (req, res) => {
    res.render('admin')
  })

  router.post('/', (req, res) => {
    this_resolution = { id: shortid.generate(), signature: req.body.signature, title: req.body.title, text: req.body.body, date: moment(req.body.date).format('DD.MM.YYYY'), chamber: req.body.chamber, result: req.body.status }
    if(db.createNew(this_resolution) !== false) {
      db.createNew(this_resolution).write()
      res.redirect('/')
    } else {
      req.flash('warning', 'Beschluss konnte nicht angelegt werden')
      res.redirect('/')
    }
  })

  return router
}
