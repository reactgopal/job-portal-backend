const Application = require('../models/Application');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');

exports.applyToJob = async ({ jobId, coverLetter }, userId, resumeUrl) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (!job.isActive) throw new ApiError(400, 'This job is no longer accepting applications');

  if (!resumeUrl) throw new ApiError(400, 'Please upload a resume before applying');

  const existing = await Application.findOne({ job: jobId, applicant: userId });
  if (existing) throw new ApiError(409, 'You have already applied to this job');

  const application = await Application.create({
    job: jobId,
    applicant: userId,
    resumeUrl,
    coverLetter,
  });

  return application;
};

exports.getMyApplications = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { applicant: userId };

  const [applications, totalDocs] = await Promise.all([
    Application.find(filter)
      .populate({
        path: 'job',
        select: 'title location jobType postedBy',
        populate: { path: 'postedBy', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
    },
  };
};

exports.getApplicationsForJob = async (jobId, userId, query) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only view applications for your own jobs');
  }

  const { page = 1, limit = 10, status } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { job: jobId };
  if (status) filter.status = status;

  const [applications, totalDocs] = await Promise.all([
    Application.find(filter)
      .populate('applicant', 'name email phone resumeUrl skills')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
    },
  };
};

exports.getApplicationById = async (applicationId, userId) => {
  const application = await Application.findById(applicationId)
    .populate('applicant', 'name email phone resumeUrl skills bio')
    .populate({
      path: 'job',
      select: 'title location jobType postedBy',
      populate: { path: 'postedBy', select: 'name' },
    });

  if (!application) throw new ApiError(404, 'Application not found');

  const isApplicant = application.applicant._id.toString() === userId.toString();
  const isJobOwner = application.job.postedBy._id.toString() === userId.toString();

  if (!isApplicant && !isJobOwner) {
    throw new ApiError(403, 'Not authorized to view this application');
  }

  return application;
};

exports.updateApplicationStatus = async (applicationId, status, userId) => {
  const application = await Application.findById(applicationId).populate('job', 'postedBy');
  if (!application) throw new ApiError(404, 'Application not found');

  if (application.job.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'Only the job poster can update application status');
  }

  application.status = status;
  await application.save();
  return application;
};
