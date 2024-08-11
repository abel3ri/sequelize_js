const router = require("express").Router();
const projectController = require("../controllers/projectController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.authenticate, projectController.getAllProjects)
  .post(authController.authenticate, authController.restrictTo("seller"), projectController.createProject);

router.route("/:id").get(authController.authenticate, projectController.getProjectById);

module.exports = router;
