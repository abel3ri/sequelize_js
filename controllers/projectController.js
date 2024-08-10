const project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");
const createProject = catchAsync(async (req, res, next) => {
  const { title, productImage, price, shortDescription, description, productUrl, category, tags } = req.body;

  const newProject = await project.create({
    title,
    productImage,
    price,
    shortDescription,
    description,
    productUrl,
    category,
    tags,
    createdBy: 1,
  });

  res.status(201).json({
    status: "success",
    data: newProject,
  });
});
module.exports = {
  createProject,
};
