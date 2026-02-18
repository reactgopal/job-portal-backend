const router = require('express').Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validate, applyJobSchema, updateStatusSchema } = require('../utils/validators');

router.use(authMiddleware);

// Candidate
router.post('/', roleMiddleware('candidate'), validate(applyJobSchema), applicationController.applyToJob);
router.get('/my-applications', roleMiddleware('candidate'), applicationController.getMyApplications);

// Company
router.get('/job/:jobId', roleMiddleware('company'), applicationController.getApplicationsForJob);

// Shared (applicant or job owner)
router.get('/:id', applicationController.getApplicationById);

// Company — update status
router.patch('/:id/status', roleMiddleware('company'), validate(updateStatusSchema), applicationController.updateStatus);

module.exports = router;
