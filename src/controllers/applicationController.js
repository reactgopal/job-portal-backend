const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const applicationService = require('../services/applicationService');

exports.applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob(
    req.body,
    req.user._id,
    req.user.resumeUrl
  );
  res.status(201).json(new ApiResponse(201, 'Application submitted', application));
});

exports.getMyApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getMyApplications(req.user._id, req.query);
  res.status(200).json(
    new ApiResponse(200, 'Applications fetched', result.applications, result.pagination)
  );
});

exports.getApplicationsForJob = asyncHandler(async (req, res) => {
  const result = await applicationService.getApplicationsForJob(
    req.params.jobId,
    req.user._id,
    req.query
  );
  res.status(200).json(
    new ApiResponse(200, 'Applications fetched', result.applications, result.pagination)
  );
});

exports.getApplicationById = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(
    req.params.id,
    req.user._id
  );
  res.status(200).json(new ApiResponse(200, 'Application fetched', application));
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.body.status,
    req.user._id
  );
  res.status(200).json(new ApiResponse(200, 'Status updated', application));
});
