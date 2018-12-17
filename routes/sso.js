module.exports = (auth) => {
  const express = require('express')
  var router    = express.Router()

  router.get('/login',
    auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
    (req, res) => {
      res.redirect('/')
    }
  )

  router.post('/login',
    auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
    (req, res) => {
      res.redirect('/')
    }
  )

  return router
}
