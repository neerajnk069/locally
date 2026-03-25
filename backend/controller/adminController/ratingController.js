const db = require("../../models");
const ratings = db.ratings;
const helper = require("../../helper/helper");
const { Sequelize } = require("sequelize");

module.exports = {
  createRating: async (req, res) => {
    try {
      const { merchant_id, traveler_session_id, rating, comment } = req.body;

      if (!merchant_id || !traveler_session_id || !rating) {
        return helper.failed(
          res,
          "merchant_id, traveler_session_id and rating are required",
        );
      }

      if (rating < 1 || rating > 5) {
        return helper.failed(res, "Rating must be between 1 to 5");
      }

      const existing = await ratings.findOne({
        where: { merchant_id, traveler_session_id },
      });

      if (existing) {
        return helper.failed(res, "You have already rated this merchant");
      }

      const data = await ratings.create({
        merchant_id,
        traveler_session_id,
        rating,
        comment,
      });

      return helper.success(res, "Rating submitted successfully", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getAllRatings: async (req, res) => {
    try {
      const data = await ratings.findAll({
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All ratings fetched", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getRatingsByMerchant: async (req, res) => {
    try {
      const data = await ratings.findAll({
        where: { merchant_id: req.params.merchant_id },
        order: [["id", "DESC"]],
      });

      return helper.success(res, "Merchant ratings fetched", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getAverageRating: async (req, res) => {
    try {
      const result = await ratings.findOne({
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "average_rating"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "total_reviews"],
        ],
        where: { merchant_id: req.params.merchant_id },
      });

      return helper.success(res, "Average rating fetched", result);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateRating: async (req, res) => {
    try {
      const data = await ratings.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Rating not found");
      }

      await ratings.update(
        {
          rating: req.body.rating || data.rating,
          comment: req.body.comment || data.comment,
        },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Rating updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  deleteRating: async (req, res) => {
    try {
      const data = await ratings.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Rating not found");
      }

      await ratings.destroy({
        where: { id: req.params.id },
      });

      return helper.success(res, "Rating deleted successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },
};
