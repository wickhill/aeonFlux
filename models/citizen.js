const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationality: { type: String, default: "please-indicate-nationality" },
  hairColor: String,
  eyeColor: String,
  is_spy: { type: Boolean },
  skills: [String],
  missions_completed: { type: String, default: "0" },
  charges: { type: String, default: "disloyalty" },
  testimonial: { type: String, default: "unverified-testimonial" },
  requiresInvestigation: { type: Boolean },
  citizenProfileImage: { type: String, default: "defaultImgPath.jpg" },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Citizen", citizenSchema);
