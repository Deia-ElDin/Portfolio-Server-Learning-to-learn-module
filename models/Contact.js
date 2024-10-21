const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide a contact'],
    trim: true,
  },
  svgLink: {
    type: String,
    required: [true, 'Must provide the contact svg link'],
  },
  info: {
    type: String,
    required: [true, 'Must provide the contact information'],
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
