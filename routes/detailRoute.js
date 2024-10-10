// week3
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const detController = require("../controllers/detController")
const utilities = require("../utilities")
// Route to build details by classification view
router.get("/detail/:classificationId", utilities.handleErrors(detController.buildByDetailId));


module.exports = router;