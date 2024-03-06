// I.N.D.U.C.E.S
//
// Index   /bookmarks             GET
// New     /bookmarks/new         GET
// Delete  /bookmarks/:id         DELETE
// Update  /bookmarks/:id         PUT/PATCH
// Create  /bookmarks             POST
// Edit    /bookmarks/:id/edit    GET
// Show    /bookmarks/:id         GET


/* modules
--------------------------------------------------------------- */

require('dotenv').config()
const path = require('path')
const express = require('express')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')

const PORT = process.env.PORT || 3000


/* db connection, controllers, models, and seed data
--------------------------------------------------------------- */

const db = require('./models');

const citizensCtrl = require('./controllers/citizens')
const userCtrl = require('./controllers/userController')
const sessionCtrl = require('./controllers/sessionController')


/* express app
--------------------------------------------------------------- */

const app = express()


/* refresh configuration
--------------------------------------------------------------- */

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


/*
--------------------------------------------------------------- */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* middleware
--------------------------------------------------------------- */

app.use(express.static('public'))
app.use(connectLiveReload());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))


/* enabling post request
--------------------------------------------------------------- */
app.use(methodOverride('_method'));
app.use(morgan('tiny'))

app.get('/', function (req, res) {
  res.redirect('/citizens')
});

app.get('/seed', function (req, res) {
    // Remove any existing citizens
    db.Citizen.deleteMany({})
        .then(removedCitizens => {
            console.log(`Removed ${removedCitizens.length} citizens`)

            // Seed citizens collection with the seed data
            db.Citizen.insertMany(db.seedCitizens)
                .then(addedCitizens => {
                    console.log(`Added ${addedCitizens.length} citizens to be investigated`)
                    res.json(addedCitizens)
                })
        })
});
// render the about us page
app.get('/about', function (req, res) {
    res.render('about')
});


/* controllers routes
--------------------------------------------------------------- */

app.use('/citizens', citizensCtrl)
app.use('/users', userCtrl)
app.use('/sessions', sessionCtrl)


/* 'catch-all' route, i.e. report to supervisor lol
--------------------------------------------------------------- */
app.get('*', function (req, res) {
    res.render('404')
});


app.listen(PORT, () => {
    console.log(`The dream to awaken our world in the year`, PORT)
})