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

// I.N.D.U.C.E.S represents the actions this controller can handle: Index, New, Delete, Update, Create, Edit, Show

// INDEX: Display a list of all citizens associated with the current user
router.get("/", (req, res) => {
  // Find all citizens in the database where the 'user' field matches the current user's ID
  db.Citizen.find({ user: req.session.currentUser._id }).then((citizens) => {
    // Render the citizen-home view, passing the retrieved citizens and the current user's data
    res.render("citizen-home", {
      citizens: citizens,
      currentUser: req.session.currentUser,
    });
  });
});

// NEW: Show form to create new citizen
router.get("/new", (req, res) => {
  // Render new-citizen view, passing current user's data
  res.render("new-citizen", { currentUser: req.session.currentUser });
});

// CREATE: Add a new citizen to database
router.post("/", async (req, res) => {
  // Convert 'requiresInvestigation' field to boolean based on form input
  req.body.requiresInvestigation =
    req.body.requiresInvestigation === "on" ? true : false;
  // Convert 'is_spy' field to boolean based on form input
  req.body.is_spy = req.body.is_spy === "true";
  console.log(req.session);
  // Set 'createdBy' field to current user's ID
  req.body.createdBy = req.session.currentUser._id;

  // Create a new citizen instance with the form data
  const newCitizen = new db.Citizen(req.body);

  try {
    // Save new citizen to database
    const savedCitizen = await newCitizen.save();
    // Redirect to new citizen's details page after successful creation
    res.redirect("/citizens/" + savedCitizen._id);
  } catch (error) {
    // Log and display any errors during save process
    console.error(error);
  }
});

// SHOW: Display details of specific citizen
router.get("/:id", function (req, res) {
  // Find citizen's by ID provided in the URL
  db.Citizen.findById(req.params.id)
    .then((citizen) => {
      // Render citizen-details view, passing found citizen and current user's data
      res.render("citizen-details", {
        citizen: citizen,
        currentUser: req.session.currentUser,
      });
    })
    .catch(() => res.render("404")); // Render 404 page if citizen isn't found
});

// EDIT: Show form to edit an existing citizen
router.get("/:id/edit", (req, res) => {
  // Find citizen by ID and render edit form with citizen's data
  db.Citizen.findById(req.params.id).then((citizen) => {
    res.render("edit-citizen", {
      citizen: citizen,
      currentUser: req.session.currentUser,
    });
  });
});

// UPDATE: Update a citizen's details in the database
router.put("/:id", async (req, res) => {
  // Update 'requiresInvestigation' field based on form input
  if (req.body.requiresInvestigation === "on") {
    req.body.requiresInvestigation = true;
  } else {
    req.body.requiresInvestigation = false;
  }

  // Prepare the update object from the form data
  const updateObject = { ...req.body };
  // Prevent blank citizenProfileImage value from erasing existing data!
  if (
    !req.body.citizenProfileImage ||
    req.body.citizenProfileImage.trim() === ""
  ) {
    delete updateObject.citizenProfileImage;
  }

  try {
    // Update citizen in database using provided ID and update data
    await db.Citizen.findByIdAndUpdate(req.params.id, updateObject, {
      new: true,
    });
    // Redirect to updated citizen's detail page
    res.redirect("/citizens/" + req.params.id);
  } catch (error) {
    // Log and handle any errors during the update process
    console.error(error);
    res.status(500).send("Error updating citizen.");
  }
});

// DELETE: Remove citizen from database
router.delete("/:id", async (req, res) => {
  // Delete citizen using provided ID
  await db.Citizen.findByIdAndDelete(req.params.id).then(() =>
    // Redirect to list of citizens after successful deletion
    res.redirect("/citizens")
  );
});

// Export router for use in other parts of application
module.exports = router;
