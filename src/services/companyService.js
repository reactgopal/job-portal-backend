const CompanyProfile = require('../models/CompanyProfile');
const ApiError = require('../utils/ApiError');

exports.getProfile = async (userId) => {
  const profile = await CompanyProfile.findOne({ user: userId }).populate('user', 'name email');
  if (!profile) throw new ApiError(404, 'Company profile not found');
  return profile;
};

exports.createProfile = async (data, userId) => {
  const exists = await CompanyProfile.findOne({ user: userId });
  if (exists) throw new ApiError(409, 'Company profile already exists. Use update instead.');

  const profile = await CompanyProfile.create({ ...data, user: userId });
  return profile;
};

exports.updateProfile = async (data, userId) => {
  const profile = await CompanyProfile.findOneAndUpdate(
    { user: userId },
    data,
    { new: true, runValidators: true }
  );
  if (!profile) throw new ApiError(404, 'Company profile not found. Create one first.');
  return profile;
};

exports.getPublicProfile = async (userId) => {
  const profile = await CompanyProfile.findOne({ user: userId }).populate('user', 'name email');
  if (!profile) throw new ApiError(404, 'Company profile not found');
  return profile;
};
