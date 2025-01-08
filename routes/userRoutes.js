const express = require('express');
const router = express.Router();
const { createUser, signIn, getAllUsers } = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const userValidation = require('../validations/userValidation');


// Public routes
router.post('/register', validateRequest(userValidation.createUser), createUser);
router.post('/login', validateRequest(userValidation.signIn), signIn);

// Protected routes
router.get('/all', getAllUsers);

module.exports = router; 