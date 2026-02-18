const Joi = require('joi');

// ── Auth ──
exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('candidate', 'company').default('candidate'),
  phone: Joi.string().allow('').optional(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

exports.updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  phone: Joi.string().allow(''),
  bio: Joi.string().max(500).allow(''),
  skills: Joi.array().items(Joi.string()),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

// ── Job ──
exports.createJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().min(20).required(),
  location: Joi.string().required(),
  jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
  salaryMin: Joi.number().min(0),
  salaryMax: Joi.number().min(Joi.ref('salaryMin')),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead').default('entry'),
  skills: Joi.array().items(Joi.string()),
  openings: Joi.number().integer().min(1).default(1),
  deadline: Joi.date().iso().greater('now'),
});

exports.updateJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().min(20),
  location: Joi.string(),
  jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship'),
  salaryMin: Joi.number().min(0),
  salaryMax: Joi.number().min(0),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead'),
  skills: Joi.array().items(Joi.string()),
  openings: Joi.number().integer().min(1),
  deadline: Joi.date().iso(),
});

// ── Application ──
exports.applyJobSchema = Joi.object({
  jobId: Joi.string().required(),
  coverLetter: Joi.string().max(2000).allow(''),
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted').required(),
});

// ── Company Profile ──
exports.companyProfileSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(100).required(),
  website: Joi.string().uri().allow(''),
  location: Joi.string().allow(''),
  description: Joi.string().max(2000).allow(''),
  industry: Joi.string().allow(''),
  employeeCount: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').allow(''),
});

// ── Helper ──
exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.body = value;
  next();
};
