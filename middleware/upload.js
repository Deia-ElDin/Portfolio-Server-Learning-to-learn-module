const multer = require('multer');
const path = require('path');

const upLoadsFolderPath = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upLoadsFolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadProjectImg = multer({ storage: storage }).single('projectImg');
const uploadProfilePic = multer({ storage: storage }).single('profilePic');

module.exports = {
  uploadProjectImg,
  uploadProfilePic,
};
