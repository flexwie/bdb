module.exports = (db) => {
  const express = require('express')
  const rmmd    = require('remove-markdown')
  const natural = require('natural')
  const token   = new natural.OrthographyTokenizer({ language: 'fi' })
  const pdf     = require('pdfkit')
  var router    = express.Router()

  // Returns all resolutions
  router.get('/', (req, res) => {
    const all = db.get('resolutions').value()
    res.render('home', {title: 'Übersicht', resolutions: all})
  })

  // Deletes resolution with :id when user is logged in
  // TODO: Add user roles (admin)
  router.get('/del/:id', (req, res, next) => {
    if(req.session.is_logged_in) {
      next()
    } else {
      req.flash('Nicht berechtigt.')
      res.redirect('/')
    }
  }, (req, res) => {
    db.get('resolutions').remove(e => {return e.id == req.params.id}).write()
    res.redirect('/')
  })

  // Shows content for single resolution via :id
  router.get('/res/:id', (req, res) => {
    const resolution = db.get('resolutions').find({ id: req.params.id }).value()
    res.render('detail', {title: 'Resolution', res: resolution})
  })

  // pipes resolution content in pdf template directly in browser
  router.get('/pdf/:id', (req, res) => {
    const reqe = db.get('resolutions').find({ id: req.params.id }).value()
    if(reqe) {

      var doc = new pdf({ size: 'a4', margin: 70.86 })
      res.contentType("application/pdf")
      doc.pipe(res)

      doc.rect(0, 77.16, 310.04, 77.16-55.12).fill('#f9cc80')

      doc.image('./public/logo.png', 315, 67.5)

      doc.rect(560, 77.16, 100, 77.16-55.12).fill('#f9cc80')

      doc.fontSize(20).fill('#000000').text(reqe.title, 70, 150)
        .fontSize(8).moveDown().text(reqe.chamber + ' - '+ reqe.date + ' - ' + reqe.signature + ' - Ergebnis: ' + reqe.result)
        .fontSize(13).moveDown().text('AntragstellerIn: ' + reqe.applicant)
       .fontSize(13)
       .moveDown()
       .text(rmmd(reqe.text, { stripListLeaders: false }), {
         width: 438.74,
         align: 'justify',
         ellipsis: true
       })

      doc.end()

    } else {
      req.flash('warning', 'Beschluss konnte nicht gefunden werden')
      res.redirecht('/')
    }
  })

  // Redirect home when search query is empty
  router.get('/s', (req, res) => res.redirect('/'))

  // Search db token entries for query string
  // TODO: implement whole search query
  router.get('/s/:query', (req, res) => {
    tokens = token.tokenize(req.params.query)
    result = db.get('resolutions').filter({ keys: tokens}).value()
    res.render('home', {title: 'Suche', resolutions: result})
  })

  return router
}
