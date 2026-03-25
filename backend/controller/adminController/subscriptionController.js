const db = require("../../models");
const Subscription = db.subscriptions;
const User = db.users;
const helper = require("../../helper/helper");

module.exports = {
  createSubscription: async (req, res) => {
    try {
      const { user_id, start_date, end_date, status } = req.body;

      if (!user_id) {
        return helper.failed(res, "user_id is required");
      }

      const data = await Subscription.create({
        user_id,
        start_date,
        end_date,
        status,
      });

      return helper.success(res, "Subscription created successfully", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getAllSubscriptions: async (req, res) => {
    try {
      const data = await Subscription.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
        ],
      });

      return helper.success(res, "All subscriptions fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getSubscriptionById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Subscription.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Subscription not found");
      }

      return helper.success(res, "Subscription fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  updateSubscription: async (req, res) => {
    try {
      const { id } = req.params;
      const { merchant_id, start_date, end_date, status } = req.body;

      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return helper.notfound(res, "Subscription not found");
      }

      await subscription.update({
        merchant_id,
        start_date,
        end_date,
        status,
      });

      return helper.success(
        res,
        "Subscription updated successfully",
        subscription,
      );
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  deleteSubscription: async (req, res) => {
    try {
      const { id } = req.params;

      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return helper.notfound(res, "Subscription not found");
      }

      await subscription.destroy();

      return helper.success(res, "Subscription deleted successfully");
    } catch (err) {
      return helper.error(res, err.message);
    }
  },
  updateSubscriptionStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!["active", "expired", "suspended"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const listing = await Subscription.findOne({
        where: { id },
      });

      if (!listing) {
        return res.status(404).json({
          message: "Listing not found",
        });
      }

      await listing.update({ status });

      res.status(200).json({
        message: "Status updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};
