const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
  profilePic: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
