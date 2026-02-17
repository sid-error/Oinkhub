const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware'); // Import protect

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers); // Search is protected
router.post('/login', authUser);

module.exports = router;