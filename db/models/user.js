"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../database");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

module.exports = sequelize.define(
  "user",

  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (value === this.password) {
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashedPassword);
        } else {
          throw new Error("password do not match.");
        }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    modelName: "user",
    freezeTableName: true,
  }
);
