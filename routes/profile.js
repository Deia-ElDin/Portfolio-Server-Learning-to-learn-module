const express = require('express');
const router = express.Router();
const { uploadProfilePic } = require('../middleware/upload');
const {
  getProfilePic,
  createProfilePic,
  updateProfilePic,
} = require('../controllers/profile');
const verifyJWT = require('../middleware/verifyJWT');

router
  .route('/')
  .get(getProfilePic)
  .post(verifyJWT, uploadProfilePic, createProfilePic);
router.route('/:id').patch(verifyJWT, uploadProfilePic, updateProfilePic);

module.exports = router;
