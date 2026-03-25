const db = require("../../models");
const Offer = db.offers;
const User = db.users;

const helper = require("../../helper/helper");

module.exports = {
  createOffer: async (req, res) => {
    try {
      const {
        user_id,
        title,
        description,
        discount_details,
        terms_conditions,
        start_date,
        end_date,
        status,
      } = req.body;

      if (!user_id || !title) {
        return helper.failed(res, "user_id and title are required");
      }

      const data = await Offer.create({
        user_id,
        title,
        description,
        discount_details,
        terms_conditions,
        start_date,
        end_date,
        status,
      });

      return helper.success(res, "Offer created successfully", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getAllOffers: async (req, res) => {
    try {
      const data = await Offer.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
        ],
      });

      return helper.success(res, "All offers fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  getOfferById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Offer.findByPk(id);

      if (!data) {
        return helper.notfound(res, "Offer not found");
      }

      return helper.success(res, "Offer fetched", data);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  updateOffer: async (req, res) => {
    try {
      const { id } = req.params;

      const offer = await Offer.findByPk(id);

      if (!offer) {
        return helper.notfound(res, "Offer not found");
      }

      await offer.update(req.body);

      return helper.success(res, "Offer updated successfully", offer);
    } catch (err) {
      return helper.error(res, err.message);
    }
  },

  deleteOffer: async (req, res) => {
    try {
      const { id } = req.params;

      const offer = await Offer.findByPk(id);

      if (!offer) {
        return helper.notfound(res, "Offer not found");
      }

      await offer.destroy();

      return helper.success(res, "Offer deleted successfully");
    } catch (err) {
      return helper.error(res, err.message);
    }
  },
  offersStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      const offer = await Offer.findOne({ where: { id } });
      await Offer.update({ status }, { where: { id } });
      const updatedOffer = await Offer.findOne({ where: { id } });
      return helper.success(res, "Offer status updated successfully", {
        id: updatedOffer.id,
        status: updatedOffer.status,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
};
