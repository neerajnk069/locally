const db = require("../../models");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");

const Category = db.categories;

module.exports = {
  addCategory: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        english_title: "required",
      });

      const errorMessage = await helper.checkValidation(validator);
      if (errorMessage) {
        return helper.failed(res, errorMessage);
      }

      const existing = await Category.findOne({
        where: { english_title: req.body.english_title },
      });
      if (existing) {
        return helper.failed(
          res,
          "Category with this English title already exists",
        );
      }

      let iconPath = null;
      if (req.files && req.files.icon) {
        iconPath = await helper.fileUpload(req.files.icon);
      }

      const category = await Category.create({
        english_title: req.body.english_title,
        french_title: req.body.french_title,
        icon: iconPath,
        status: req.body.status || "active",
      });

      return helper.success(res, "Category added successfully", category);
    } catch (error) {
      console.error("addCategory Error:", error.message);
      return helper.error(res, "Server Error" + error.message);
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All categories fetched", categories);
    } catch (error) {
      console.error("getCategories Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return helper.notfound(res, "Category not found");
      }

      return helper.success(res, "Category details fetched", category);
    } catch (error) {
      console.error("viewCategory Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return helper.notfound(res, "Category not found");
      }

      let iconPath = category.icon;

      if (req.files && req.files.icon) {
        iconPath = await helper.fileUpload(req.files.icon);
      }

      await category.update({
        english_title: req.body.english_title || category.english_title,
        french_title: req.body.french_title || category.french_title,
        icon: iconPath,
        status: req.body.status || category.status,
      });

      return helper.success(res, "Category updated successfully", category);
    } catch (error) {
      console.error("updateCategory Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return helper.notfound(res, "Category not found");
      }

      await category.destroy();

      return helper.success(res, "Category deleted successfully");
    } catch (error) {
      console.error("deleteCategory Error:", error);
      return helper.error(res, "Server Error");
    }
  },
  categoryStatus: async (req, res) => {
    try {
      console.log("BODY:", req.body);
      const { id, status } = req.body;

      const category = await Category.findOne({ where: { id } });
      if (!category) {
        return helper.failed(res, "Category not found");
      }
      await category.update({ status });

      return helper.success(res, "Category status updated successfully", {
        id: category.id,
        status: category.status,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
};
