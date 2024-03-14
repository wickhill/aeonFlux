const express = require("express");
const router = express.Router();
const db = require("../models");
const Citizen = require("../models/citizen");

router.get("/", async (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/sessions/new");
  }

  const userReports = await Citizen.find({
    createdBy: req.session.currentUser._id,
  });
  res.render("reports/index", {
    citizens: userReports,
    currentUser: req.session.currentUser,
  });
});

// EDIT
router.get("/:id/edit", async (req, res) => {
  try {
    const citizen = await db.Citizen.findOne({
      _id: req.params.id,
      createdBy: req.session.currentUser._id,
    });
    if (!citizen) {
      return res.status(404).send("Report not on database. Contact Supervisor");
    }
    res.render("./reports/edit.ejs", {
      citizen: citizen,
      currentUser: req.session.currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Kiosk error. Please Contact Supervisor Immediately.");
  }
});

module.exports = router;
