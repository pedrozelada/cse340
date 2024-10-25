// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/getbyIDitem", utilities.handleErrors(invController.getInventoryJSON))


module.exports = router;