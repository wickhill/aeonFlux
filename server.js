// I.N.D.U.C.E.S
//
// Index   /citizens             GET
// New     /citizens/new         GET
// Delete  /citizens/:id         DELETE
// Update  /citizens/:id         PUT/PATCH
// Create  /citizens             POST
// Edit    /citizens/:id/edit    GET
// Show    /citizens/:id         GET

/* modules
--------------------------------------------------------------- */

require("dotenv").config();
const path = require("path");
const express = require("express");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const PORT = process.env.PORT || 3000;

/* db connection, controllers, models, and seed data
--------------------------------------------------------------- */

const db = require("./models");

const citizensCtrl = require("./controllers/citizens");
const userCtrl = require("./controllers/userController");
const sessionCtrl = require("./controllers/sessionController");
const dossierCtrl = require("./controllers/dossierController");
const reportsController = require("./controllers/reportsController");

const citizens = require("./models/seed");

/* express app
--------------------------------------------------------------- */

const app = express();

/* refresh configuration
--------------------------------------------------------------- */

// Detect if running in a dev environment
if (process.env.ON_HEROKU === "false") {
  // Configure the app to refresh the browser when nodemon restarts
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    // wait for nodemon to fully restart before refreshing the page
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

/*
--------------------------------------------------------------- */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* middleware
--------------------------------------------------------------- */

app.use(express.static("public"));
app.use(connectLiveReload());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

/* enabling post request
--------------------------------------------------------------- */
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

// Setting up ROOT route, catches requests made to HOME URL, redirects to '/citizens'

app.get("/", function (req, res) {
  res.redirect("/citizens");
});

// SEED function
app.get("/seed", function (req, res) {
  // Remove any existing citizens
  db.Citizen.deleteMany({}).then((removedCitizens) => {
    console.log(`Removed ${removedCitizens.length} citizens`);

    // Seed citizens collection with the seed data
    db.Citizen.insertMany(db.seedCitizens).then((addedCitizens) => {
      console.log(`Added ${addedCitizens.length} citizens to be investigated`);
      res.json(addedCitizens);
    });
  });
});
// Render ABOUT Chairman Goodchild page
app.get("/about", function (req, res) {
  const trevor = citizens.find(
    (citizen) => citizen.name === "trevor goodchild"
  );
  res.render("about", { citizen: trevor });
});

/* controllers routes
--------------------------------------------------------------- */

app.use("/citizens", citizensCtrl);
app.use("/users", userCtrl);
app.use("/sessions", sessionCtrl);
app.use("/dossiers", dossierCtrl);
app.use("/reports", reportsController);

/* 'catch-all' route, i.e. report to supervisor :)
--------------------------------------------------------------- */
app.get("*", function (req, res) {
  res.render("404");
});

// Server initialization
app.listen(PORT, () => {
  console.log(`The dream to awaken our world in the year`, PORT);
});
