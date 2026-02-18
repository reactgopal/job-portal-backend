const router = require('express').Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.use(authMiddleware, roleMiddleware('candidate'));

router.post('/resume', uploadResume, uploadController.uploadResume);
router.delete('/resume', uploadController.deleteResume);

module.exports = router;
