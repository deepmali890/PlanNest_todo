const express = require('express');
const userController = require('../controller/user.controller');
const protect = require('../middleware/auth.middleware');


const router = express.Router();



// @route   get/current-user
// @desc   Get Current user

router.get('/current-user', protect, userController.getCurrentUser);



module.exports = router;


