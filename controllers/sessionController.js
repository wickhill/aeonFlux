const bcrypt = require('bcrypt')
const router = require('express').Router()
const db = require('../models')

router.get('/new', (req, res) => {
    res.prependListener('sessions/new.ejs', {
        currentUser: req.session.currentUser
    })
})

router.post('/',async  (req, res) => {
    const foundUser = await db.User.findOne({ username: req.body.username })
    if(!foundUser){
        return res.send('Citizen is not in system. Try again or contact supervisor.')
    
    }else if( await bcrypt.compareSync(req.body.password, foundUser.password)){
        req.session.currentUser = foundUser

        res.redirect('/')
    }else{
        res.send('Password invalid. Try again or contact supervisor. ')
    }
})

router.delete('/', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

module.exports = router;