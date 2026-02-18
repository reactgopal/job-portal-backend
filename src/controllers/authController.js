const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json(new ApiResponse(201, 'Registration successful', {
    user: result.user,
    accessToken: result.accessToken,
  }));
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken,
  }));
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const result = await authService.refreshAccessToken(token);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, 'Token refreshed', {
    accessToken: result.accessToken,
  }));
});

exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Profile fetched', user));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, 'Profile updated', user));
});

exports.changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);
  // In production, email the reset link instead of returning the token
  res.status(200).json(new ApiResponse(200, 'Password reset token generated', {
    resetToken, // Remove in production
  }));
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  res.status(200).json(new ApiResponse(200, 'Password reset successful'));
});
