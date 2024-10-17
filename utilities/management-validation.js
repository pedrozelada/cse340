const utilities = require(".")
const { body, validationResult } = require("express-validator")
const managementModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // classification_name is required and must  be non-empty and match the regex pattern
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
 * Check data and return errors or continue to registration
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
  
  module.exports = validate
