const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}


/* **********************************
  *  Registration Data Validation Rules for Vehicle
  * ********************************* */
validate.reviewRegistrationRules = () => {
    return [
      // description is required
      body("review_text")
        .trim()
        .notEmpty()
        .withMessage("Please provide a valid description."),
  
    ]
  }
  
  /* ******************************
   * Check data and return errors or continue to registration for vehicle
   * ***************************** */
  
validate.checkReviewData = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const classification_id = req.body.classification_id;  
      const data = await invModel.getInventoryById(classification_id);
      const section = await utilities.buildDetailSection(data);
      let nav = await utilities.getNav();
      let reviews = await utilities.getReviews(data.inv_id);
      const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  
      // Render the detail page with error messages and existing form data
      return res.render("./detail/detail", {
        errors: errors.array(),       // Use errors.array() for EJS template
        title: className,
        nav,
        section,
        reviews,
        inv_id: data.inv_id,
        review_text: req.body.review_text // Retain review_text value for form
      });
    }
  
    next();
  };
module.exports = validate