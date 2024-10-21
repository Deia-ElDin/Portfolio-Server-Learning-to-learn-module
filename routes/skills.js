const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deteleSkill,
} = require('../controllers/skills');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/').get(getAllSkills).post(verifyJWT, createSkill);
router
  .route('/:id')
  .patch(verifyJWT, updateSkill)
  .delete(verifyJWT, deteleSkill);

module.exports = router;
