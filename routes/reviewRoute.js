// Needed Resources
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities")
const revValidate = require('../utilities/review-validation')



// Add a new review
router.post(
    "/add-review", 
    utilities.checkLogin, 
    revValidate.reviewRegistrationRules(),
    revValidate.checkReviewData,
    utilities.handleErrors(reviewController.addReview));

// Route to build edit a review
router.get("/edit-review/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildEditReview));

// Route to build edit a review
router.get("/delete-review/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildDeleteReview));

// Process a review
router.post(
    "/edit-review", 
    utilities.checkLogin,
    revValidate.reviewRegistrationRules(),
    revValidate.checkEditReviewData, 
    utilities.handleErrors(reviewController.updateReview));

// Delete a review
router.post(
    "/delete-review", 
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.deleteReview));

module.exports = router;