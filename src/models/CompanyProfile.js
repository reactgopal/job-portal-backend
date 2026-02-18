const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true, trim: true },
    website: { type: String, default: '' },
    location: { type: String, default: '' },
    logo: { type: String, default: '' },
    description: { type: String, maxlength: 2000, default: '' },
    industry: { type: String, default: '' },
    employeeCount: {
      type: String,
      enum: ['', '1-10', '11-50', '51-200', '201-500', '500+'],
      default: '',
    },
  },
  { timestamps: true }
);

companyProfileSchema.index({ companyName: 'text' });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
