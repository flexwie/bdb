module.exports = (db, auth) => {
  const express = require('express')
  const shortid = require('shortid')
  const moment  = require('moment')
  const natural = require('natural')
  const key     = require('keyword-extractor')
  const token   = new natural.OrthographyTokenizer({ language: 'fi' })
  var router    = express.Router()

  // Middleware to see if user is logged in
  // router.use((req, res, next) => {
  //   if(req.session.is_logged_in) {
  //     next()
  //   } else {
  //     req.flash('warning', 'Nicht eingeloggt')
  //     res.redirect('/login')
  //   }
  // })

  // Add new resolution form
  router.get('/', (req, res, next) => {
    if(req.isAuthenticated()) {
      return next()
    }
    res.send('no')
  }, (req, res) => {
    res.render('admin', {title: 'Neuer Beschluss'})
  })

  // Add a new resolution to db and validate its schema
  router.post('/', (req, res, next) => {
    if(req.isAuthenticated()) {
      return next()
    }
    res.redirect('/sso/login')
  }, (req, res) => {
    text_keys = key.extract(req.body.body, { language: 'german', remove_digits: true, return_changed_case: true, remove_duplicates: true })
    this_resolution = { id: shortid.generate(), keys: text_keys.concat(token.tokenize(req.body.title.toLowerCase())), signature: req.body.signature, title: req.body.title, text: req.body.body, date: moment(req.body.date).format('DD.MM.YYYY'), chamber: req.body.chamber, result: req.body.status, applicant: req.body.applicant }
    if(db.createNew(this_resolution) !== false) {
      db.createNew(this_resolution).write()
      res.redirect('/')
    } else {
      req.flash('warning', 'Beschluss konnte nicht angelegt werden')
      res.redirect('/')
    }
  })

  // Edit existing resolution
  // WARNING: NOT WORKING
  router.get('/:id', (req, res) => {
    const resolution = db.get('resolutions').find({ id: req.params.id }).value()
    console.log(resolution)
    res.render('admin', {title: 'Bearbeite', el: resolution})
  })

  return router
}
