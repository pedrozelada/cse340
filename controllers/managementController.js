const utilities = require("../utilities/")
const inventoryModel = require("../models/inventory-model")

//Deliver Management view
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
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
  let classification_id = req.body.classification_id || null

  let classification = await utilities.buildClassificationList(classification_id)

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
async function registerClassification(req, res, next) {
  
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
*  Process Registration Vehicle
* *************************************** */
async function registerVehicle(req, res, next) {
  
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


//Deliver edit vehicle view
async function buildEditVehicle(req, res, next) {
  const vehicle_id = parseInt(req.params.classificationId)
  let nav = await utilities.getNav()
  const itemData = await inventoryModel.getInventoryById(vehicle_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
  


/* ****************************************
*  Process Update Vehicle
* *************************************** */
async function updateVehicle(req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const updateResult = await inventoryModel.updateVehicle(
    inv_id,  
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model

    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
    
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

//Deliver edit vehicle view
async function buildDeleteVehicle(req, res, next) {
  const vehicle_id = parseInt(req.params.classificationId)
  let nav = await utilities.getNav()
  const itemData = await inventoryModel.getInventoryById(vehicle_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ****************************************
*  Process Delete Vehicle
* *************************************** */
async function deleteVehicle(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await inventoryModel.deleteVehicle(
    inv_id
  )

  if (deleteResult) {

    req.flash("notice", `The deletion was successful.`)
    res.redirect("/inv/")
    
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`); 
  }
}



module.exports = { buildManagement, buildAddClassification, buildAddVehicle, registerClassification, registerVehicle, 
  buildEditVehicle, updateVehicle, buildDeleteVehicle, deleteVehicle }