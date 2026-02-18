const router = require('express').Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validate, createJobSchema, updateJobSchema } = require('../utils/validators');

// Public
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Protected — Company only
router.use(authMiddleware);
router.get('/user/my-jobs', roleMiddleware('company'), jobController.getMyJobs);
router.post('/', roleMiddleware('company'), validate(createJobSchema), jobController.createJob);
router.put('/:id', roleMiddleware('company'), validate(updateJobSchema), jobController.updateJob);
router.patch('/:id/toggle', roleMiddleware('company'), jobController.toggleJob);
router.delete('/:id', roleMiddleware('company', 'admin'), jobController.deleteJob);

module.exports = router;
