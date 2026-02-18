const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../utils/validators');

// Public
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);

// Protected
router.use(authMiddleware);
router.get('/me', authController.getMe);
router.put('/update-profile', validate(updateProfileSchema), authController.updateProfile);
router.put('/change-password', validate(changePasswordSchema), authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
