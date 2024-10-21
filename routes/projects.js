const express = require("express");
const router = express.Router();
const { uploadProjectImg } = require("../middleware/upload");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(getAllProjects)
  .post(verifyJWT, uploadProjectImg, createProject);
router
  .route("/:id")
  .patch(verifyJWT, uploadProjectImg, updateProject)
  .delete(verifyJWT, deleteProject);

module.exports = router;
