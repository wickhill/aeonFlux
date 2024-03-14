const bcrypt = require("bcrypt");
const router = require("express").Router();
const db = require("../models");

// Route for Login page
router.get("/new", (req, res) => {
  // Render login page (new.ejs w/in sessions dir) and pass current user
  res.render("sessions/new.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Route to handle login logic
router.post("/", async (req, res) => {
  // Attempt to find user in database by username
  const foundUser = await db.User.findOne({ username: req.body.username });
  if (!foundUser) {
    // If user isn't found, send error message
    return res.send(
      "Citizen is not in system. Try again or contact supervisor."
    );
  } else if (await bcrypt.compareSync(req.body.password, foundUser.password)) {
    // If user is found and password matches, set the currentUser in the session
    req.session.currentUser = foundUser;
    // Redirect to homepage after successful login
    res.redirect("/");
  } else {
    // If password doesn't match, send error message
    res.send("Password invalid. Try again or contact supervisor.");
  }
});

// Route to handle Logout
router.delete("/", (req, res) => {
  // Destroy current session to logout user
  req.session.destroy(() => {
    // Redirect to homepage after logout
    res.redirect("/");
  });
});

module.exports = router;
