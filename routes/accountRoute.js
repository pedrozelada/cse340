//week4 Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build Login 
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build Registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Week5 Edit user
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));


// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

// week5 Proceess update
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateUser)
);

// week5 password update
router.post(
  "/updatePassword",
  regValidate.passwordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

// Week5 account view
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccount));

// Week5 logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  req.flash("notice", "You have successfully logged out.");
  res.redirect('/');
});


module.exports = router;