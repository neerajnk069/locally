const db = require("../../models");
const carts = db.carts;
const helper = require("../../helper/helper");

module.exports = {
  createCart: async (req, res) => {
    try {
      const { merchant_id, offer_id, traveler_session_id, amount, status } =
        req.body;

      if (!amount) {
        return helper.failed(res, "Amount is required");
      }

      const data = await carts.create({
        merchant_id,
        offer_id,
        traveler_session_id,
        amount,
        status: status || 0,
      });

      return helper.success(res, "Cart created successfully", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getAllCarts: async (req, res) => {
    try {
      const data = await carts.findAll({
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All carts fetched successfully", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getCartById: async (req, res) => {
    try {
      const data = await carts.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Cart not found");
      }

      return helper.success(res, "Cart details", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateCart: async (req, res) => {
    try {
      const data = await carts.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Cart not found");
      }

      await carts.update(
        {
          merchant_id: req.body.merchant_id || data.merchant_id,
          offer_id: req.body.offer_id || data.offer_id,
          traveler_session_id:
            req.body.traveler_session_id || data.traveler_session_id,
          amount: req.body.amount || data.amount,
          status: req.body.status || data.status,
        },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Cart updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const data = await carts.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Cart not found");
      }

      await carts.update(
        { status: req.body.status },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Cart status updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  deleteCart: async (req, res) => {
    try {
      const data = await carts.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Cart not found");
      }

      await carts.destroy({
        where: { id: req.params.id },
      });

      return helper.success(res, "Cart deleted successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },
};
