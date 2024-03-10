/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/citizens`
---------------------------------------------------------------------------------------
*/

/* Require modules
--------------------------------------------------------------- */
const express = require("express");
// Router allows us to handle routing outisde of server.js
const router = express.Router();
// bring in the isAuthenticated middleware
const isAuthenticated = require("../controllers/isAuthenticated");

/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require("../models");

router.use(isAuthenticated); // attached the isAuthenticated middleware to the router
// this applies to all routes in this file

// I.N.D.U.C.E.S
//
// INDEX
router.get("/", (req, res) => {
    db.Citizen.find({ user: req.session.currentUser._id }).then((citizens) => {
      res.render("citizen-home", { 
          citizens: citizens,
          currentUser: req.session.currentUser
       });
    });
  // res.send(citizens) - res.send sends back raw data or html
  // to send ejs we use
  // ------- res.render(view, {data})
  // - view represents an ejs page, will check for this file name in the views folder
  // noramally in an object {key: value}
  // when a key and value have the same name you can just put the variable there
});

// NEW
router.get("/new", (req, res) => {
  res.render("new-citizen", { currentUser: req.session.currentUser });
});

// CREATE / POST / route= "/citizens"
// router.post("/", async (req, res) => {
//   req.body.requiresInvestigation = req.body.requiresInvestigation === "on" ? true : false;
//   req.body.is_spy = req.body.is_spy === "true";
//   console.log(req.session);
//   req.body.user = req.session.currentUser._id;
//   await db.Citizen.create(req.body).then((citizen) =>
//     res.redirect("/citizens/" + citizen._id)
//   );
// });


router.post("/", async (req, res) => {
  req.body.requiresInvestigation = req.body.requiresInvestigation === "on" ? true : false;
  req.body.is_spy = req.body.is_spy === "true";
  console.log(req.session);
  req.body.createdBy = req.session.currentUser._id;

  const newCitizen = new db.Citizen(req.body);

  try {
    const savedCitizen = await newCitizen.save();
    res.redirect("/citizens/" + savedCitizen._id);
  } catch (error) {
    console.error(error);
  }
});


// Show Route (GET/Read): Will display an individual citizen document
// using the URL parameter (which is the document _id)
router.get("/:id", function (req, res) {
  db.Citizen.findById(req.params.id)
    .then((citizen) => {
      res.render("citizen-details", {
        citizen: citizen,
        currentUser: req.session.currentUser 
      });
    })
    .catch(() => res.render("404"));
});

// Edit Route (GET/Read): This route renders a form
// the user will use to PUT (edit) properties of an existing citizen
router.get("/:id/edit", (req, res) => {
  db.Citizen.findById(req.params.id).then((citizen) => {
    res.render("edit-citizen", {
        citizen: citizen,
      currentUser: req.session.currentUser 
    });
  });
});

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route,
// edits the specified citizen document using the form data,
// and redirects the user back to the show page for the updated location.
router.put("/:id", async (req, res) => {
  req.body.requiresInvestigation = req.body.requiresInvestigation === "on" ? true : false;
  await db.Citizen.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (citizen) => res.redirect("/citizens/" + citizen._id)
  );
});

// Destroy Route (DELETE/Delete): This route deletes a citizen document
// using the URL parameter (which will always be the citizen document's ID)
router.delete("/:id", async (req, res) => {
  await db.Citizen.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/citizens")
  );
});

module.exports = router;
