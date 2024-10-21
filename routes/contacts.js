const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/').get(getAllContacts).post(verifyJWT, createContact);
router
  .route('/:id')
  .patch(verifyJWT, updateContact)
  .delete(verifyJWT, deleteContact);

module.exports = router;
