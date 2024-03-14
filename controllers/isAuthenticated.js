// Define middleware function to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if there's a currentUser in the session
  if (req.session.currentUser) {
    // If there's a currentUser, proceed to next middleware / route handler
    return next();
  } else {
    // If there isn't a currentUser in session, redirect user to login page
    res.redirect("/sessions/new");
  }
};

module.exports = isAuthenticated;
