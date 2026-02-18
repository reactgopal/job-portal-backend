const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/adminService');

exports.getDashboard = asyncHandler(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, 'Dashboard stats', stats));
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, 'Users fetched', result.users, result.pagination));
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  res.status(200).json(new ApiResponse(200, 'User role updated', user));
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  res.status(200).json(new ApiResponse(200, 'User deleted'));
});

exports.getAllJobs = asyncHandler(async (req, res) => {
  const result = await adminService.getAllJobsAdmin(req.query);
  res.status(200).json(new ApiResponse(200, 'Jobs fetched', result.jobs, result.pagination));
});

exports.deleteJob = asyncHandler(async (req, res) => {
  await adminService.deleteJobAdmin(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Job deleted'));
});

exports.getAnalytics = asyncHandler(async (_req, res) => {
  const data = await adminService.getAnalytics();
  res.status(200).json(new ApiResponse(200, 'Analytics data', data));
});
