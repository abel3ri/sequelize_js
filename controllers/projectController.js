const Project = require("../db/models/project");
const User = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const { title, productImage, price, shortDescription, description, productUrl, category, tags } = req.body;
  const creatorId = req.user.id;

  const newProject = await Project.create({
    title,
    productImage,
    price,
    shortDescription,
    description,
    productUrl,
    category,
    tags,
    createdBy: creatorId,
  });

  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

const getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.findAll({
    include: {
      model: User,
      attributes: { exclude: ["password", "passwordChangedAt", "deletedAt"] },
    },
  });

  res.status(200).json({
    status: "success",
    count: projects.length,
    data: projects,
  });
});

const getProjectById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);
  res.status(200).json({
    status: "success",
    data: project,
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
};
