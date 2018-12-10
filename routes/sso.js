module.exports = () => {
  const express = require('express')
  const saml   = require('samlify')
  const fs      = require('fs')
  var router    = express.Router()

  // example followed: https://samlify.js.org/#/?id=samlify
  // WARNING: NOT WORKING
  const idp = saml.IdentityProvider({
    metadata: fs.readFileSync('./metadata/fzs.xml')
  })

  const sp = saml.ServiceProvider({
    metadata: fs.readFileSync('./metadata/local.xml')
  })

  router.get('/local.xml', (req, res) => {
    res.sendFile('./metadata/local.xml')
  })

  router.get('/login', (req, res) => {
    const { id, context } = sp.createLoginRequest(idp, 'redirect')
    res.redirect(context)
  })

  router.post('/assert', (req, res) => {
    sp.parseLoginResponse(idp, 'post', req).then(result => {
      console.log(result)
      req.session.is_logged_in = true
      res.redirect('/')
    }).catch(console.error)
  })

  return router
}
