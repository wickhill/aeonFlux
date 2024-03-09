const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nationality: { type: String, default: "please-indicate-nationality"},
    is_spy: {type: Boolean},
    hairColor: String,
    eyeColor: String,
    skills: [String],
    gender: String,
    missions_completed: { type: Number, default: 0 },
    charges: { type: String, default: "disloyalty" },
    img: { type: String, default: "defaultImgPath.jpg" },
    requiresInvestigation: { type: Boolean }

  });



module.exports = mongoose.model("Citizen", citizenSchema)
