const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const companyService = require('../services/companyService');

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await companyService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Company profile fetched', profile));
});

exports.createProfile = asyncHandler(async (req, res) => {
  const profile = await companyService.createProfile(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, 'Company profile created', profile));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const profile = await companyService.updateProfile(req.body, req.user._id);
  res.status(200).json(new ApiResponse(200, 'Company profile updated', profile));
});

exports.getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await companyService.getPublicProfile(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Public profile fetched', profile));
});
