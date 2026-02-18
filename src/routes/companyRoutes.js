const router = require('express').Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validate, companyProfileSchema } = require('../utils/validators');

// Public
router.get('/:id/public', companyController.getPublicProfile);

// Protected — Company only
router.use(authMiddleware, roleMiddleware('company'));
router.get('/profile', companyController.getProfile);
router.post('/profile', validate(companyProfileSchema), companyController.createProfile);
router.put('/profile', validate(companyProfileSchema), companyController.updateProfile);

module.exports = router;
