const router = require("express").Router();
const { User } = require("../models");
const db = require("../models");
const bcrypt = require("bcrypt");

// Route to serve the user registration page
router.get("/new", (req, res) => {
  // Render the registration page (newKioskUser.ejs within users directory) and pass the current user, if any
  res.render("users/newKioskUser", { currentUser: req.session.currentUser });
});

// Registration route logic
router.post("/", async (req, res) => {
  // Convert username to lowercase, i.e. unique to avoid case-sensitive issues!
  req.body.username = req.body.username.toLowerCase();

  try {
    // Check if user already exists in database
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      // If user exists, return error message
      return res.send(
        'This citizen already exists. Try again, or contact Supervisor. <a href="/">Kiosk Homepage</a>'
      );
    }

    // If user doesn't exist, hash the password
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(4) // Generate some salt and hash that password!
    );

    // Create a new user with hashed password
    const newUser = await User.create(req.body);
    console.log(newUser); // Log new user for potential debugging
    res.redirect("/"); // Redirect to homepage after successful registration
  } catch (error) {
    // Log any errors w/ an error message
    console.error(error);
    res.status(500).send("Registration error. Wait for Supervisor assistance.");
  }
});

module.exports = router;
