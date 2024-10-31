const reviewModel = require("../models/review-model");
const utilities = require("../utilities/")


/* ****************************************
 *  Process New Review
 * *************************************** */
async function addReview(req, res, next) {
  const { review_text, inv_id, account_id } = req.body
  const regResult = await reviewModel.addReview(review_text, inv_id, account_id)

  if (regResult) {
    req.flash("notice", "Your review has been added.");
    res.redirect(`/inv/detail/${inv_id}`);
} else {

  req.flash("notice", "Sorry, the registration failed.")
  res.redirect(`/inv/detail/${inv_id}`);
  
}
}

/* ****************************************
 *  Build view edit review
 * *************************************** */
async function buildEditReview(req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(reviewData.review_date).toLocaleDateString("en-US", options);

  const className = 'Edit ' + reviewData.inv_year + ' ' + reviewData.inv_make + ' ' + reviewData.inv_model + ' Review '
  res.render("reviews/edit-review", { 
    title: className, 
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_date: formattedDate,
    review_text: reviewData.review_text,
    
  });
}


/* ****************************************
 *  Build View Delete Review
 * *************************************** */
async function buildDeleteReview(req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(reviewData.review_date).toLocaleDateString("en-US", options);

  const className = 'Delete ' + reviewData.inv_year + ' ' + reviewData.inv_make + ' ' + reviewData.inv_model + ' Review '
  res.render("reviews/delete-review", { 
    title: className, 
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_date: formattedDate,
    review_text: reviewData.review_text,
  });
}

/* ****************************************
 *  Proccess edit review
 * *************************************** */

async function updateReview(req, res, next) {
  let nav = await utilities.getNav()
  const {review_id, review_text} = req.body
  const updateResult = await reviewModel.updateReview(
    review_id,  
    review_text  
  )
  if (updateResult) {
    req.flash("notice", "Your review has been updated.");
    res.redirect(`/account/`);
} else {
  req.flash("notice", "Sorry, the update failed.")
  res.redirect(`/review/edit-review/${review_id}`);

}
}

/* ****************************************
 *  Delete a Review
 * *************************************** */
async function deleteReview(req, res) {
  const review_id = parseInt(req.body.review_id)
  const deleteResult = await reviewModel.deleteReview(
    review_id
  )

  if (deleteResult) {

    req.flash("notice", `Your review has been deleted.`)
    res.redirect("/account")
    
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/account`); 
  }
}


module.exports = { addReview, buildEditReview, updateReview, deleteReview, buildDeleteReview };