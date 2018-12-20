module.exports = (auth) => {
  const express = require('express')
  var router    = express.Router()

  router.get('/login',
    auth.authenticate('saml', (req, res) => {
      req.login(req.user, (err))
    }),
    (req, res) => {
      res.redirect('/')
    }
  )

  router.post('/assert',
    auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
    (req, res) => {
      req.session.save(_ => {
        res.redirect('/')
      })
    }
  )

  router.get('/logout', (req, res) => {
    console.log('logging out')
    req.logout()
    res.redirect('/')
  })

  return router
}
