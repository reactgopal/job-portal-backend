const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');

exports.createJob = async (data, userId) => {
  const job = await Job.create({ ...data, postedBy: userId });
  return job;
};

exports.getAllJobs = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    location,
    jobType,
    experienceLevel,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }
  if (location) filter.location = new RegExp(location, 'i');
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const [jobs, totalDocs] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
    },
  };
};

exports.getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate('postedBy', 'name email');
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

exports.updateJob = async (jobId, userId, data) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only update your own jobs');
  }

  Object.assign(job, data);
  await job.save();
  return job;
};

exports.deleteJob = async (jobId, userId, userRole) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own jobs');
  }

  await job.deleteOne();
  return true;
};

exports.getMyJobs = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { postedBy: userId };

  const [jobs, totalDocs] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
    },
  };
};

exports.toggleJob = async (jobId, userId) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only toggle your own jobs');
  }

  job.isActive = !job.isActive;
  await job.save();
  return job;
};
