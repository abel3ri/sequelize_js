"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../database");
const bcrypt = require("bcryptjs");
const AppError = require("../../utils/appError");

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
      allowNull: false,
      validate: {
        notNull: {
          msg: "userType can not be null",
        },
        notEmpty: {
          msg: "userType can not be empty",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "firstName can not be null",
        },
        notEmpty: {
          msg: "firstName can not be empty",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "lastName can not be null",
        },
        notEmpty: {
          msg: "lastName can not be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email can not be null",
        },
        notEmpty: {
          msg: "email can not be empty",
        },
        isEmail: {
          msg: "please provide a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password can not be null",
        },
        notEmpty: {
          msg: "password can not be empty",
        },
      },
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (this.password.length < 8) {
          throw new AppError("password must be at least 8 characters long", 400);
        }
        if (value === this.password) {
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashedPassword);
        } else {
          throw new AppError("password do not match", 400);
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
