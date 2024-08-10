"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

module.exports = sequelize.define(
  "project",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title can not be null",
        },
        notEmpty: {
          msg: "title can not be empty",
        },
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[false, true]],
          msg: "isFeatured must be either true or false",
        },
      },
    },
    productImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "productImage can not be null",
        },
        notEmpty: {
          msg: "productImage can not be empty",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "price can not be null",
        },
        isDecimal: {
          msg: "price must be of type decimal",
        },
      },
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shortDescription can not be null",
        },
        notEmpty: {
          msg: "shortDescription can not be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description can not be null",
        },
        notEmpty: {
          msg: "description can not be empty",
        },
      },
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "productUrl can not be null",
        },
        notEmpty: {
          msg: "productUrl can not be empty",
        },
        isUrl: {
          msg: "invalid productUrl",
        },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
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
    modelName: "project",
    freezeTableName: true,
  }
);
