const db = require("../../models");
const merchant_images = db.merchant_images;
const helper = require("../../helper/helper");

module.exports = {
  createImage: async (req, res) => {
    try {
      let imagePath = null;

      if (req.files && req.files.image) {
        imagePath = await helper.fileUpload(req.files.image);
      }

      const data = await merchant_images.create({
        merchant_id: req.body.merchant_id,
        image: imagePath,
      });

      return helper.success(res, "Merchant image added successfully", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getAllImages: async (req, res) => {
    try {
      const data = await merchant_images.findAll();
      return helper.success(res, "All merchant images", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await merchant_images.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Image not found");
      }

      return helper.success(res, "Merchant image details", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateImage: async (req, res) => {
    try {
      const data = await merchant_images.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Image not found");
      }

      let imagePath = data.image;

      if (req.files && req.files.image) {
        imagePath = await helper.fileUpload(req.files.image);
      }

      await merchant_images.update(
        {
          merchant_id: req.body.merchant_id || data.merchant_id,
          image: imagePath,
        },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Merchant image updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  deleteImage: async (req, res) => {
    try {
      const data = await merchant_images.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Image not found");
      }

      await merchant_images.destroy({
        where: { id: req.params.id },
      });

      return helper.success(res, "Merchant image deleted successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },
};
