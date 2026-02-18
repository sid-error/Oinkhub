const express = require('express');
const { registerUser, authUser, allUsers, updateUserProfile } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware'); // Import protect

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers); // Search is protected
router.post('/login', authUser);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;