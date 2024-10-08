const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const detCont = {}

/* ***************************
 *  Build detail of each vehicle
 * ************************** */
detCont.buildByDetailId = async function (req, res, next) {
  try {
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryById(classification_id)
  const section = await utilities.buildDetailSection(data)
  let nav = await utilities.getNav()
  const className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
  res.render("./detail/detail", {
    title: className,
    nav,
    section,
  });

} catch (error) {
  console.error(`Error in buildByDetailId: ${error.message}`);
  next(error); 
}
}
module.exports = detCont