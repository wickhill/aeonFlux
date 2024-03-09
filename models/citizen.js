const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nationality: { type: String, default: "please-indicate-nationality"},
    is_spy: {type: Boolean},
    hairColor: String,
    eyeColor: String,
    skills: [String],
    missions_completed: { type: String, default: "0" },
    charges: { type: String, default: "disloyalty" },
    testimonial: { type: String, default: "unverified-testimonial" },
    citizenProfileImage: { type: String, default: "defaultImgPath.jpg" },
    requiresInvestigation: { type: Boolean }

  });



module.exports = mongoose.model("Citizen", citizenSchema)
