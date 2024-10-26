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
// Route to edit vehicle
router.get("/edit/:classificationId", utilities.handleErrors(managementController.buildEditVehicle));
// Route to delete vehicle
router.get("/delete/:classificationId", utilities.handleErrors(managementController.buildDeleteVehicle));


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

// Process update vehicle
router.post(
  "/update",
  regValidate.vehicleRegistrationRules(),
  regValidate.checkUpdateData, 
  utilities.handleErrors(managementController.updateVehicle)
)

// Process delete vehicle
router.post(
  "/delete",
  utilities.handleErrors(managementController.deleteVehicle)
)



module.exports = router;
