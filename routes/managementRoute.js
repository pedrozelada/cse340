//week4 Needed Resources 
const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")
const utilities = require("../utilities")
const regValidate = require('../utilities/management-validation')

// Route to build Management
router.get("/", utilities.handleErrors(managementController.buildManagement));
// Route to build Add clasification
router.get("/add-classification", utilities.handleErrors(managementController.buildAddClassification));
// Route to build Add vehicle
router.get("/add-vehicle", utilities.handleErrors(managementController.buildAddVehicle));

// Process registration classification
router.post(
  "/add-classification",
  regValidate.registationRules(),
  regValidate.checkClassData,
  utilities.handleErrors(managementController.registerClassification)
)

// Process registration vehicle
router.post(
  "/add-vehicle",
  regValidate.vehicleRegistrationRules(),
  regValidate.checkVehicleData,
  utilities.handleErrors(managementController.registerVehicle)
)
module.exports = router;
