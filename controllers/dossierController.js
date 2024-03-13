const express = require("express");
const router = express.Router();
const Citizen = require("../models/citizen");

router.get("/", async (req, res) => {
  const citizens = await Citizen.find({});
  console.log(citizens);
  res.render("dossiers/index", { citizens });
});

module.exports = router;
