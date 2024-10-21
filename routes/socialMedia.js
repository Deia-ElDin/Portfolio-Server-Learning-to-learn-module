const express = require('express');
const router = express.Router();
const {
  getAllSocialMedias,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
} = require('../controllers/socialMedia');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/').get(getAllSocialMedias).post(verifyJWT, createSocialMedia);
router
  .route('/:id')
  .patch(verifyJWT, updateSocialMedia)
  .delete(verifyJWT, deleteSocialMedia);

module.exports = router;
