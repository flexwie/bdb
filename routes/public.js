module.exports = db => {
	const express = require('express')
	const rmmd = require('remove-markdown')
	const pdf = require('pdfkit')
	var router = express.Router()

	router.get('/', async (req, res) => {
		try {
			const all = await db.find()
			res.render('home', { title: 'Übersicht', resolutions: all })
		} catch (e) {
			req.flash('warning', 'Error fetching your resolutions')
			res.render('home', { title: 'Übersicht', resolutions: all })
		}
	})

	router.get('/res/:id', async (req, res) => {
		try {
			const resolution = await db.findById(req.params.id)
			res.render('home', { title: 'Übersicht', resolutions: resolution })
		} catch (e) {
			req.flash('warning', 'Error fetching your resolution')
			res.render('detail', { title: 'Übersicht', res: {} })
		}
	})

	router.get('/login', (req, res) => {
		res.render('login', { title: 'Login' })
	})

	router.post('/login', async (req, res) => {
		let { name, pass } = req.body

		if (name == null || pass == null) {
			req.flash('Bitte gebe deine Daten an')
			res.redirect('/login')
		}

		req.session.is_logged_in = true
		res.redirect('/admin')

		// const user = await db.find()
	})

	router.get('/logout', (req, res) => {
		req.session.destroy()
		res.redirect('/')
	})

	router.get('/pdf/:id', async (req, res) => {
		const reqe = await db.findById(req.params.id)
		if (reqe) {
			var doc = new pdf({ size: 'a4', margin: 70.86 })
			res.writeHead(200, {
				'Content-disposition': 'attachment; filename=' + 'resolution.pdf',
				'Content-Type': 'application/pdf',
			})

			doc.pipe(res)

			doc.rect(0, 77.16, 310.04, 77.16 - 55.12).fill('#f9cc80')

			doc.image('./public/logo.png', 315, 67.5)

			doc.rect(560, 77.16, 100, 77.16 - 55.12).fill('#f9cc80')

			doc
				.fontSize(20)
				.fill('#000000')
				.text(reqe.title, 70, 150)
				.fontSize(8)
				.moveDown()
				.text(
					reqe.chamber +
						' - ' +
						reqe.date +
						' - ' +
						reqe.signature +
						' - Ergebnis: ' +
						reqe.result
				)
				.fontSize(13)
				.moveDown()
				.text('AntragstellerIn: ' + reqe.applicant)
				.fontSize(13)
				.moveDown()
				.text(rmmd(reqe.text, { stripListLeaders: false }), {
					width: 438.74,
					align: 'justify',
					ellipsis: true,
				})

			doc.end()
		} else {
			req.flash('warning', 'Beschluss konnte nicht gefunden werden')
			res.redirecht('/')
		}
	})

	router.get('/s', (req, res) => res.redirect('/'))

	router.get('/s/:query', (req, res) => {
		try {
			db.search(
				{ query_string: { query: req.params.query } },
				{ hydrate: true },
				(err, data) => {
					if (err) {
						console.error(err)
						req.flash('warning', 'Search failed')
						res.redirect('/')
					} else {
						res.render('home', {
							title: 'Suche',
							resolutions: data.hits.hits,
						})
					}
				}
			)
		} catch (e) {
			console.error(e)
			req.flash('warning', 'Search failed')
			res.redirect('/')
		}
	})

	return router
}
