const db = require("../../models");
const Merchant = db.merchants;
const helper = require("../../helper/helper");

module.exports = {
  createMerchant: async (req, res) => {
    try {
      const {
        user_id,
        category_id,
        description,
        website,
        whatsapp_link,
        opening_hours,
      } = req.body;

      if (!user_id) {
        return helper.failed(res, "user_id is required");
      }

      const data = await Merchant.create({
        user_id,
        category_id,
        description,
        website,
        whatsapp_link,
        opening_hours,
      });

      return helper.success(res, "Merchant created successfully", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getAllMerchants: async (req, res) => {
    try {
      const data = await Merchant.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: users,
            as: "user",
            attributes: [
              "name",
              "business_name",
              "email",
              "profile_logo",
              "city",
            ],
            where: { role: "1", status: "1" },
          },
        ],
      });

      return helper.success(res, "All merchants fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },
  getMerchantById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Merchant.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Merchant not found");
      }

      return helper.success(res, "Merchant fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  updateMerchant: async (req, res) => {
    try {
      const { id } = req.params;

      const merchant = await Merchant.findByPk(id);

      if (!merchant) {
        return helper.notfound(res, "Merchant not found");
      }

      await merchant.update(req.body);

      return helper.success(res, "Merchant updated successfully", merchant);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  deleteMerchant: async (req, res) => {
    try {
      const { id } = req.params;

      const merchant = await Merchant.findByPk(id);

      if (!merchant) {
        return helper.notfound(res, "Merchant not found");
      }

      await merchant.destroy();

      return helper.success(res, "Merchant deleted successfully");
    } catch (err) {
      return helper.error(res, err.message);
    }
  },
};
