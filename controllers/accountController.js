const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
//Hash
const bcrypt = require("bcryptjs")
// week5
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/* ****************************************
*  week4 Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Account view
 * ************************************ */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  })
}



/* ****************************************
 *  Update Account view
 * ************************************ */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
    res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
    })
}


/* ****************************************
*  Process Update User
* *************************************** */
async function updateUser(req, res, next) {
  let nav = await utilities.getNav()
  const {account_id, account_firstname, account_lastname, account_email} = req.body
  const updateResult = await accountModel.updateUser(
    account_id,  
    account_firstname,
    account_lastname,
    account_email  
  )
  if (updateResult) {
    req.flash("notice", `Congratulations, your information has been updated`)

    const accountData = await accountModel.getAccountById(account_id);
    res.locals.account_firstname = account_firstname;
    res.locals.account_lastname = account_lastname;
    res.locals.account_email = account_email;
    res.locals.account_type = accountData.account_type;
      // update token
    const updatedToken = jwt.sign(
      {
        account_id: account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
        account_type: accountData.account_type
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );
    res.cookie("jwt", updatedToken, { httpOnly: true, maxAge: 3600 * 1000 });
    res.redirect("/account/")    
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id,  
      account_firstname,
      account_lastname,
      account_email
    })
  }
}


/* ****************************************
*  Process Update Password
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {account_id, account_password} = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing your request.')
    res.status(500).render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(
    account_id,  
    hashedPassword
  )
  if (updateResult) {
    req.flash("notice", `Congratulations, your password has been updated`)
    res.redirect("/account/")    
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
    })
  }
}


module.exports = { buildLogin, buildRegister , registerAccount, accountLogin, buildAccount, buildUpdateAccount, 
  updateUser, updatePassword}