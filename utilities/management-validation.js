const utilities = require(".")
const { body, validationResult } = require("express-validator")
const managementModel = require("../models/inventory-model")
const validate = {}

const currentYear = new Date().getFullYear();
/*  **********************************
  *  Registration Data Validation Rules for Classification 
  * ********************************* */
validate.registationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification Name must contain alphabetic characters only, with no spaces or special characters.") // on error this message is sent.
        .custom(async (classification_name) => {
            const clasificationExists = await managementModel.checkExistingClassification(classification_name)
            if (clasificationExists){
              throw new Error("Classification already exists. Please use different classification")
            }
        }),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration for classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
     return
  }
   next()
}


/* **********************************
  *  Registration Data Validation Rules for Vehicle
  * ********************************* */
validate.vehicleRegistrationRules = () => {
  return [
    // classification is required and must be an option
    body("classification_id")
      .trim()
      .isInt()
      .withMessage("Please choose a valid classification."),

    // make is required and must be at least 3 characters
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make with at least 3 characters."),

    // imodel is required and must be at least 3 characters
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model with at least 3 characters."),

    // description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid description."),

    // image is required and must be a string
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid image path."),

    // thumbnail is required and must be a string
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid thumbnail path."),

    // price is required and must be a decimal or integer
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price as a decimal or integer."),

      body("inv_year")
      .trim()
      .isInt({ min: 1886, max: currentYear })
      .withMessage("Please provide a valid 4-digit year.")
      .custom((value) => {
        const yearString = value.toString();
        if (yearString.length !== 4) {
          throw new Error("Year must be a 4-digit number.");
        }
        if (value < 1886) {
          throw new Error("Cars didn't exist before 1886.");
        }
        if (value > currentYear) {
          throw new Error("That year hasn't come yet.");
        }
        return true;
      }),

    // miles is required and must be an integer
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide valid miles as a number."),

    // color is required and must be a string
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid color."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration for vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classification = await utilities.buildClassificationList(classification_id)  // Build classification list for the dropdown again
    res.render("inventory/add-vehicle", {
      errors,
      title: "Add Vehicle",
      nav,
      classification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate
