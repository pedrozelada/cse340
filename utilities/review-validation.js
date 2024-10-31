const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const validate = {}


/* **********************************
  *  Registration Data Validation Rules for Review
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
   * Check data and return errors or continue to add review
   * ***************************** */
  
validate.checkReviewData = async (req, res, next) => {
    const {classification_id , review_text} = req.body
    let errors = []
    errors = validationResult(req)    
    if (!errors.isEmpty()) {
      const data = await invModel.getInventoryById(classification_id);
      const section = await utilities.buildDetailSection(data);
      let nav = await utilities.getNav();
      let reviews = await utilities.getReviews(data.inv_id);
      const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  
      // Render the detail page with error messages and existing form data
      return res.render("./detail/detail", {
        errors,
        title: className,
        nav,
        section,
        reviews,
        inv_id: data.inv_id,
        review_text
      });
    }
  
    next();
  };
module.exports = validate


  /* ******************************
   * Check data and return errors or continue to edit review
   * ***************************** */
  
  validate.checkEditReviewData = async (req, res, next) => {
    const {review_text, review_id } = req.body
    let errors = []
    errors = validationResult(req)    
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const reviewData = await reviewModel.getReviewById(review_id);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date(reviewData.review_date).toLocaleDateString("en-US", options);

      const className = 'Edit ' + reviewData.inv_year + ' ' + reviewData.inv_make + ' ' + reviewData.inv_model + ' Review '
      res.render("reviews/edit-review", { 
        title: className, 
        nav,
        errors,
        review_id,
        review_date: formattedDate,
        review_text
        
      })
      return
    }
    next()
  }
  
module.exports = validate
