const express = require("express");
const router = express.Router();
const Citizen = require("../models/citizen");

// Define route to handle GET requests for root of dossier routes
router.get("/", async (req, res) => {
  // Retrieve all citizens from database without any filters (empty object as filter)
  const citizens = await Citizen.find({});
  console.log(citizens);
  // Render 'index' view within 'dossiers' directory, passing retrieved 'citizens' for display
  res.render("dossiers/index", { citizens });
});

module.exports = router;
