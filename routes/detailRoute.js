// week3
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const detController = require("../controllers/detController")
// Route to build details by classification view
router.get("/detail/:classificationId", detController.buildByDetailId);


module.exports = router;