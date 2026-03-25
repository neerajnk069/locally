const db = require("../../models");
const ConciergePartner = db.concierge_partners;
const helper = require("../../helper/helper");

module.exports = {
  createConcierge: async (req, res) => {
    try {
      const { concierge_id, merchant_id } = req.body;

      if (!concierge_id || !merchant_id) {
        return helper.failed(res, "concierge_id and merchant_id are required");
      }

      const data = await ConciergePartner.create({
        concierge_id,
        merchant_id,
      });

      return helper.success(res, "Partner created successfully", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getAllDetails: async (req, res) => {
    try {
      const data = await ConciergePartner.findAll();
      return helper.success(res, "All partners fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await ConciergePartner.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Partner not found");
      }

      return helper.success(res, "Partner fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  updateConcierge: async (req, res) => {
    try {
      const { id } = req.params;
      const { concierge_id, merchant_id } = req.body;

      const data = await ConciergePartner.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Partner not found");
      }

      await data.update({
        concierge_id,
        merchant_id,
      });

      return helper.success(res, "Partner updated successfully", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  deleteConcierge: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await ConciergePartner.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Partner not found");
      }

      await data.destroy();

      return helper.success(res, "Partner deleted successfully");
    } catch (err) {
      return helper.error(res, err.message);
    }
  },
};
