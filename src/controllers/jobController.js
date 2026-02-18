const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const jobService = require("../services/jobService");

exports.createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, "Job created successfully", job));
});

exports.getAllJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getAllJobs(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, "Jobs fetched", result.jobs, result.pagination));
});

exports.getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json(new ApiResponse(200, "Job fetched", job));
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, "Job updated", job));
});

exports.deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id, req.user.role);
  res.status(200).json(new ApiResponse(200, "Job deleted"));
});

exports.getMyJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getMyJobs(req.user._id, req.query);
  res
    .status(200)
    .json(
      new ApiResponse(200, "Your jobs fetched", result.jobs, result.pagination),
    );
});

exports.toggleJob = asyncHandler(async (req, res) => {
  const job = await jobService.toggleJob(req.params.id, req.user._id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Job ${job.isActive ? "activated" : "deactivated"}`,
        job,
      ),
    );
});
