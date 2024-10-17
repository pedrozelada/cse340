const utilities = require("../utilities/")
const inventoryModel = require("../models/inventory-model")

//Deliver Management view
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  }

//Deliver add Classification view
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

//Deliver add Vehicle view
async function buildAddVehicle(req, res, next) {
  let nav = await utilities.getNav()
  let classification = await utilities.buildClassificationList()
  res.render("inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    classification,
    errors: null,
  })
}

/* ****************************************
*  Process Registration Classification
* *************************************** */
async function registerClassification(req, res) {
  
  const { classification_name } = req.body

  const regResult = await inventoryModel.registerClassification(
    classification_name 
  )

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you have registered the ${classification_name } classification.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}


/* ****************************************
*  Process Registration Classification
* *************************************** */
async function registerVehicle(req, res) {
  
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await inventoryModel.registerVehicle(
    inv_make,
    inv_model,
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id  
  )

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you have registered the vehicle ${inv_make} ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    let classification = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classification,
      errors: null,
    })
  }
}
  

module.exports = { buildManagement, buildAddClassification, buildAddVehicle, registerClassification, registerVehicle }