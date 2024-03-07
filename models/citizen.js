const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nationality: { type: String, default: "bregna"},
    is_spy: {type: Boolean},
    hairColor: { type: String, default: "black" },
    eyeColor: { type: String, default: "blue" },
    skills: [String],
    gender: String,
    missions_completed: { type: Number, default: 0 },
    charges: { type: String, default: "disloyalty" },
    img: { type: String, default: "defaultImgPath.jpg" },
    requiresInvestigation: { type: Boolean, default: true }

  });



module.exports = mongoose.model("Citizen", citizenSchema)
