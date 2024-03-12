const router = require('express').Router()
const { User } = require('../models');
const db = require('../models')
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/newCitizen', {currentUser: req.session.currentUser})
})

// router.post('/', async (req, res) => {
//     req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(4))
//     const newUser = await User.create(req.body)
//     console.log(newUser)
//     res.redirect('/')
// })


router.post('/', async (req, res) => {
    req.body.username = req.body.username.toLowerCase();

    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            if (existingUser) {
                return res.send('This citizen already exists. Try again, or contact Supervisor. <a href="/">Kiosk Homepage</a>');
            }
            
        }
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(4));
        const newUser = await User.create(req.body);
        console.log(newUser);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Registration error. Wait for Supervisor assistance.');
    }
});


module.exports = router