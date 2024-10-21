const mongoose = require('mongoose');

const SocialMediaSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide a social media'],
    trim: true,
  },
  svgLink: {
    type: String,
    required: [true, 'Must provide the social media svg link'],
    trim: true,
  },
  link: {
    type: String,
    required: [true, 'Must provide the social media link'],
    trim: true,
  },
});

module.exports = mongoose.model('Media', SocialMediaSchema);
