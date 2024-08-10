const router = require("express").Router();
const projectController = require("../controllers/projectController");

router.route("/").post(projectController.createProject);

module.exports = router;
