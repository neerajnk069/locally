const db = require("../../models");
const conciergeRequest = db.conciergerequest;
const bcrypt = require("bcryptjs");
const common = require("../../helper/helper");
const user = db.users;

module.exports = {
  createConciergeRequest: async (req, res) => {
    try {
      const { name, email, phone, message, category_id } = req.body;

      if (!name || !email || !phone || !message || !category_id) {
        return common.failed(res, "All fields are required");
      }

      const existing = await conciergeRequest.findOne({ where: { email } });
      if (existing) {
        return common.failed(res, "Email already exists");
      }

      let profileImage = null;

      if (req.files && req.files.profile_image) {
        profileImage = await common.fileUpload(req.files.profile_image);
      }

      const data = await conciergeRequest.create({
        id: common.unixTimestamp(),
        name,
        email,
        phone,
        category_id,
        message,
        profile_image: profileImage || "",
      });

      return common.success(
        res,
        "Concierge request submitted successfully",
        data,
      );
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  getAllConciergeRequests: async (req, res) => {
    try {
      let { page, limit, search, dateFilter } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      dateFilter = dateFilter || "all";

      const Op = db.Sequelize.Op;
      const whereCondition = {};

      if (search && search.trim() !== "") {
        whereCondition[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      if (dateFilter !== "all") {
        const daysAgo = parseInt(dateFilter, 10);
        if (!isNaN(daysAgo)) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - daysAgo);
          whereCondition.createdAt = { [Op.gte]: startDate };
        }
      }

      const { count, rows } = await conciergeRequest.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.categories,
            as: "category",
            attributes: ["id", "english_title", "french_title"],
          },
        ],
        distinct: true,
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return common.success(res, "Concierge request list", {
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalConciergeRequest: count,
      });
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  getSingleConciergeRequest: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await conciergeRequest.findOne({ where: { id } });

      if (!data) {
        return common.notfound(res, "Concierge request not found");
      }

      return common.success(res, "Concierge request detail", data);
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  deleteConciergeRequest: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await conciergeRequest.findOne({ where: { id } });

      if (!data) {
        return common.notfound(res, "Concierge request not found");
      }

      await conciergeRequest.destroy({ where: { id } });

      return common.success(res, "Concierge request deleted successfully");
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },
  updateConciergeRequestStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const listing = await conciergeRequest.findOne({
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
  updateConciergeRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        country_code,
        phone,
        // category,
        category_id,
        address,
        description,
      } = req.body;
      // console.log(req.body, ">>>>>>>>>>");
      // return;

      const concierge = await conciergeRequest.findOne({ where: { id } });

      if (!concierge) {
        return common.notfound(res, "concierge request not found");
      }

      if (email && email !== concierge.email) {
        const emailExist = await conciergeRequest.findOne({
          where: { email },
        });

        if (emailExist) {
          return common.failed(res, "Email already exists");
        }
      }
      const hashedNewPassword = await bcrypt.hash(req.body.password, 10);
      await user.create({
        name: req.body.name,
        email: req.body.email,
        country_code: req.body.country_code,
        phone: req.body.phone,
        password: hashedNewPassword,
        // category: req.body.category,
        category_id: req.body.category_id,
        address: req.body.address,
        description: req.body.description,
        role: "2",
      });

      await conciergeRequest.destroy({
        where: {
          id: req.params.id,
        },
      });

      return common.success(res, "Concierge request updated successfully", {
        data: concierge,
      });
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong", error.message);
    }
  },
};
