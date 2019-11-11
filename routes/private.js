module.exports = (db) => {
  const express = require('express')
  const shortid = require('shortid')
  const moment  = require('moment')
  const natural = require('natural')
  const key     = require('keyword-extractor')
  const token   = new natural.OrthographyTokenizer({ language: 'fi' })
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
    res.render('admin', {title: 'Neuer Beschluss'})
  })

  router.post('/', async (req, res) => {
    text_keys = key.extract(req.body.body, { language: 'german', remove_digits: true, return_changed_case: true, remove_duplicates: true })
    text_keys = text_keys.concat(token.tokenize(req.body.title.toLowerCase()))

    const post = new db({ meta: {created_by: req.ip}, keys: text_keys, signature: req.body.signature, title: req.body.title, text: req.body.body, date: moment(req.body.date), chamber: req.body.chamber, result: req.body.status, applicant: req.body.applicant })
    await post.save().catch(e => {
      console.error(e)
      req.flash('warning', 'Konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder wenden Sie sich an Ihren Systemadmin.')
    })
    res.redirect('/')
  })

  router.get('/:id', async (req, res) => {
    const resolution = await db.find({ id: req.params.id })
    res.render('admin', {title: 'Bearbeite', el: resolution})
  })

  router.get('/del/:id', async (req, res) => {
    await db.findOneAndDelete({ _id: req.params.id }).catch(e => {console.error(e)})
    res.redirect('/')
  })

  return router
}
