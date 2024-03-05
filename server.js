// I.N.D.U.C.E.S
//
// Index   /bookmarks             GET
// New     /bookmarks/new         GET
// Delete  /bookmarks/:id         DELETE
// Update  /bookmarks/:id         PUT/PATCH
// Create  /bookmarks             POST
// Edit    /bookmarks/:id/edit    GET
// Show    /bookmarks/:id         GET

require('dotenv').config()
const path = require('path')
const express = require('express')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')

const PORT = process.env.PORT || 3000

const db = require('./models');

const citizensCtrl = require('./controllers/citizens')
const userCtrl = require('./controllers/userController')

const app = express()

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.listen(PORT, () => {
    console.log(`The dream to awaken our world in the year`, PORT)
})