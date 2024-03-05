const router = require('express').Router()
const { User } = require('../models');
const db = require('./models')
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

router.post('/', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(4))
    const newUser = await User.create(req.body)

})