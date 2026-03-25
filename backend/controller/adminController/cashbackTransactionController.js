const db = require("../../models");
const cashback = db.cashback_transactions;
const helper = require("../../helper/helper");

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const {
        redemption_id,
        merchant_id,
        concierge_id,
        total_amount,
        concierge_share,
        admin_share,
        status,
      } = req.body;

      if (
        !redemption_id ||
        !merchant_id ||
        !concierge_id ||
        !total_amount ||
        !concierge_share ||
        !admin_share
      ) {
        return helper.failed(res, "All required fields must be filled");
      }

      const data = await cashback.create({
        redemption_id,
        merchant_id,
        concierge_id,
        total_amount,
        concierge_share,
        admin_share,
        status: status || "pending",
      });

      return helper.success(res, "Cashback transaction created", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const data = await cashback.findAll({
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All transactions fetched", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const data = await cashback.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Transaction not found");
      }

      return helper.success(res, "Transaction details", data);
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const data = await cashback.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Transaction not found");
      }

      await cashback.update(
        {
          redemption_id: req.body.redemption_id || data.redemption_id,
          merchant_id: req.body.merchant_id || data.merchant_id,
          concierge_id: req.body.concierge_id || data.concierge_id,
          total_amount: req.body.total_amount || data.total_amount,
          concierge_share: req.body.concierge_share || data.concierge_share,
          admin_share: req.body.admin_share || data.admin_share,
          status: req.body.status || data.status,
          paid_at: req.body.status === "paid" ? new Date() : data.paid_at,
        },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Transaction updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const data = await cashback.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Transaction not found");
      }

      await cashback.update(
        {
          status: req.body.status,
          paid_at: req.body.status === "paid" ? new Date() : null,
        },
        { where: { id: req.params.id } },
      );

      return helper.success(res, "Status updated successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const data = await cashback.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return helper.notfound(res, "Transaction not found");
      }

      await cashback.destroy({
        where: { id: req.params.id },
      });

      return helper.success(res, "Transaction deleted successfully");
    } catch (error) {
      return helper.error(res, error.message);
    }
  },
};
