const invModel = require("../models/inventory-model")
const Util = {}

// week5
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailSection = async function(data){
  let section
  
  //section = '<h1>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h1>'
  section = '<div id="informationCar">'
  section += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" >'
  section += '<div class="carDetails">'
  section += '<h2>' + data.inv_make + ' ' + data.inv_model + ' details</h2>'
  section += '<p><strong>Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</strong></p>'
  section += '<p><strong>Description:</strong> ' + data.inv_description + '</p>'
  section += '<p><strong>Color:</strong> ' + data.inv_color + '</p>'
  section += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
  section += '</div></div>'


  return section
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


// Build Select Classification form
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     // values
    res.locals.isLoggedIn = true;
    res.locals.account_firstname = accountData.account_firstname || "User"; 
    res.locals.account_lastname = accountData.account_lastname;
    res.locals.account_email = accountData.account_email;
    res.locals.account_type = accountData.account_type;
    res.locals.account_id = accountData.account_id;
     next()
    })
  } else {
    res.locals.isLoggedIn = false;
    res.locals.account_firstname = null;
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 *  Check employee or Admin
 * ************************************ */
 Util.checkAdminOrEmployee = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      req.flash("notice", "Session expired. Please log in again.");
      res.clearCookie("jwt");
      return res.redirect("/account/login");
    }

    // Check 'Employee' or 'Admin'
    if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
      // Set account data and logged-in status for view rendering
      res.locals.isLoggedIn = true;
      res.locals.account_firstname = accountData.account_firstname;
      res.locals.account_type = accountData.account_type;
      return next();
    } else {
      req.flash("notice", "You do not have permission to access this page.");
      return res.redirect("/account/login");
    }
  });
}
module.exports = Util