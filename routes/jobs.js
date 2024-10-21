const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  updatedJob,
  deleteJob,
} = require('../controllers/jobs');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/').get(getAllJobs).post(verifyJWT, createJob);
router.route('/:id').patch(verifyJWT, updatedJob).delete(verifyJWT, deleteJob);

module.exports = router;
