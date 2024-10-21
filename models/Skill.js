const mongoose = require('mongoose');

const SkillSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide the technology name'],
  },
  svgLink: {
    type: String,
    required: [true, 'Must provide the technology svg link'],
  },
  percentage: {
    type: Number,
    required: [true, 'Must provide the technology percentage'],
  },
});

module.exports = mongoose.model('Skill', SkillSchema);
