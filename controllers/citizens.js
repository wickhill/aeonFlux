/* 
---------------------------------------------------------------------------------------
All routes on this page are prefixed with `localhost:3000/citizens`
---------------------------------------------------------------------------------------
*/

/* Require modules
--------------------------------------------------------------- */
const express = require("express");
// Router allows us to handle routing outisde of server.js
const router = express.Router();
// bring in the isAuthenticated middleware
const isAuthenticated = require("../controllers/isAuthenticated");


/* Require db connection and models
--------------------------------------------------------------- */
const db = require("../models");

router.use(isAuthenticated);

// I.N.D.U.C.E.S

// INDEX
router.get("/", (req, res) => {
    db.Citizen.find({ user: req.session.currentUser._id }).then((citizens) => {
      res.render("citizen-home", { 
          citizens: citizens,
          currentUser: req.session.currentUser
       });
    });
});

// NEW
router.get("/new", (req, res) => {
  res.render("new-citizen", { currentUser: req.session.currentUser });
});

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

// Show:
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

// Edit:
router.get("/:id/edit", (req, res) => {
  db.Citizen.findById(req.params.id).then((citizen) => {
    res.render("edit-citizen", {
        citizen: citizen,
      currentUser: req.session.currentUser 
    });
  });
});

// Update:
router.put("/:id", async (req, res) => {
  req.body.requiresInvestigation = req.body.requiresInvestigation === "on" ? true : false;
  await db.Citizen.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (citizen) => res.redirect("/citizens/" + citizen._id)
  );
});

// Delete:
router.delete("/:id", async (req, res) => {
  await db.Citizen.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/citizens")
  );
});

module.exports = router;
