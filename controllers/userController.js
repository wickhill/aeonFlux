const router = require('express').Router()
const { User } = require('../models');
const db = require('../models')
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/newCitizen', {currentUser: req.session.currentUser})
})
router.post('/', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(4))
    const newUser = await User.create(req.body)
    console.log(newUser)
    res.redirect('/')
})

module.exports = router