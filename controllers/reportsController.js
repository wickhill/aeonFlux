const express = require("express");
const router = express.Router();
const db = require("../models");
const Citizen = require("../models/citizen");

router.get("/", async (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/sessions/new");
  }

  // Find all citizen reports created by current user
  const userReports = await Citizen.find({
    createdBy: req.session.currentUser._id,
  });
  // Render 'reports/index' page, passing userReports and currentUser data
  res.render("reports/index", {
    citizens: userReports,
    currentUser: req.session.currentUser,
  });
});

// EDIT route: Define a GET route for editing specific citizen report
router.get("/:id/edit", async (req, res) => {
  try {
    // Attempt to find citizen report by ID and createdBy, ensure user has permission to edit data / profile
    const citizen = await db.Citizen.findOne({
      _id: req.params.id,
      createdBy: req.session.currentUser._id,
    });
    // If report isn't found, send a 404 error message
    if (!citizen) {
      return res.status(404).send("Report not on database. Contact Supervisor");
    }
    // Render edit page with citizen and currentUser data
    res.render("./reports/edit.ejs", {
      citizen: citizen,
      currentUser: req.session.currentUser,
    });
  } catch (error) {
    // Log errors
    console.error(error);
    res.status(500).send("Kiosk error. Please Contact Supervisor Immediately.");
  }
});

module.exports = router;
