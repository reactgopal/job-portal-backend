const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a file');
  }

  const user = await User.findById(req.user._id);

  // Delete old resume from Cloudinary if exists
  if (user.resumePublicId) {
    await deleteFromCloudinary(user.resumePublicId);
  }

  // Upload new resume
  const { url, publicId } = await uploadToCloudinary(req.file.buffer);

  user.resumeUrl = url;
  user.resumePublicId = publicId;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, 'Resume uploaded successfully', {
    resumeUrl: url,
  }));
});

exports.deleteResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.resumePublicId) {
    throw new ApiError(400, 'No resume to delete');
  }

  await deleteFromCloudinary(user.resumePublicId);

  user.resumeUrl = '';
  user.resumePublicId = '';
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, 'Resume deleted successfully'));
});
