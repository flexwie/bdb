module.exports = (db) => {
  const express = require('express')
  const rmmd    = require('remove-markdown')
  const pdf     = require('pdfkit')
  var router    = express.Router()

  router.get('/', async (req, res) => {
    const all = await db.find()
    res.render('home', {title: 'Übersicht', resolutions: all})
  })

  router.get('/res/:id', async (req, res) => {
    const resolution = await db.findById(req.params.id).catch(e => {console.error(e)})
    res.render('detail', {title: 'Resolution', res: resolution})
  })

  router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
  })

  router.post('/login', (req, res) => {
    if(req.body.name == 'fzs' && req.body.pass == 'bdbtool') {
      req.session.is_logged_in = true
      res.redirect('/')
    } else {
      req.flash('warning', 'Falsche Daten')
      res.redirect('/login')
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

  router.get('/res/:id', (req, res) => {
    const resolution = db.get('resolutions').find({ id: req.params.id }).value()
    res.render('detail', {title: 'Resolution', res: resolution})
  })

  router.get('/pdf/:id', async (req, res) => {
    const reqe = await db.findById(req.params.id)
    if(reqe) {

      var doc = new pdf({ size: 'a4', margin: 70.86 })
      res.writeHead(200, {
        'Content-disposition': 'attachment; filename=' + 'resolution.pdf',
        'Content-Type': 'application/pdf'
      })

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

  router.get('/s', (req, res) => res.redirect('/'))

  router.get('/s/:query', (req, res) => {
    db.search({ query_string: { query: req.params.query } }, {hydrate: true}, (err, data) => {
      console.log(data)
      if(err) throw err
      res.render('home', {title: "Suche", resolutions: data.hits.hits})
    })  

  })

  return router
}
