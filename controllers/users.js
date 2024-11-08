const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.home = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index", { allListings });
};

module.exports.signupForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutForm = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
};
