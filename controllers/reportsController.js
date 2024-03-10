const express = require('express')
const router = express.Router()
const db = require('../models')

// router.get('/', async (req, res) => {
//     if (!req.session.currentUser) {
//         return res.redirect('/session/new')
//     }

//     const userCitizens = await db.Citizen.find({ user: req.session.currentUser._id })
//     res.render('reports/index', { currentUser: req.session.currentUser, citizens: userCitizens });
// })

router.get('/reports', async (req, res) => {
    if (!req.session.currentUser) {
        return res.redirect('/session/new');
    }

    const userReports = await Citizen.find({ createdBy: req.session.currentUser._id });
    res.render('reports/index', { citizens: userReports });
});




module.exports = router;