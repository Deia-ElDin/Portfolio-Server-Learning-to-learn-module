const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
  countryName: {
    type: String,
    required: [true, 'Must provide the country name'],
    trim: true,
  },
  countrySVGLink: {
    type: String,
    required: [true, 'Must provide the country flag'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Must provide the company name'],
    trim: true,
  },
  jobTitle: {
    type: String,
    required: [true, 'Must provide the job title'],
    trim: true,
  },
  jobDescription: {
    type: String,
    required: [true, 'Must provide the job description'],
    trim: true,
  },
  startingDate: {
    type: String,
    required: [true, 'Must provide the starting date'],
    trim: true,
  },
  finishingDate: {
    type: String,
    required: [true, 'Must provide the finishing date'],
    trim: true,
  },
});

module.exports = mongoose.model('Job', JobSchema);
