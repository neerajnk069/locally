const db = require("../../models");
const bcrypt = require("bcryptjs");
const merchantRequest = db.merchantrequest;
const user = db.users;

const common = require("../../helper/helper");

module.exports = {
  createMerchantRequest: async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !phone || !message) {
        return common.failed(res, "All fields are required");
      }

      const existing = await merchantRequest.findOne({ where: { email } });
      if (existing) {
        return common.failed(res, "Email already exists");
      }

      let profileImage = null;

      if (req.files && req.files.profile_image) {
        profileImage = await common.fileUpload(req.files.profile_image);
      }

      const data = await merchantRequest.create({
        id: common.unixTimestamp(),
        name,
        email,
        phone,
        message,
        status: "pending",
        profile_image: profileImage || "",
      });

      return common.success(
        res,
        "Merchant request submitted successfully",
        data,
      );
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  getAllMerchantRequests: async (req, res) => {
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

      const { count, rows } = await merchantRequest.findAndCountAll({
        where: whereCondition,
        distinct: true,
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return common.success(res, "Merchant request list", {
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalMerchantRequest: count,
      });
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  getSingleMerchantRequest: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await merchantRequest.findOne({ where: { id } });

      if (!data) {
        return common.notfound(res, "Merchant request not found");
      }

      return common.success(res, "Merchant request detail", data);
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },

  deleteMerchantRequest: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await merchantRequest.findOne({ where: { id } });

      if (!data) {
        return common.notfound(res, "Merchant request not found");
      }

      await merchantRequest.destroy({ where: { id } });

      return common.success(res, "Merchant request deleted successfully");
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong");
    }
  },
  updateMerchantRequestStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const listing = await merchantRequest.findOne({
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
  updateMerchantRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, country_code, phone, message } = req.body;
      // console.log(req.body, ">>>>>>>>>>");
      // return;

      const merchant = await merchantRequest.findOne({ where: { id } });

      if (!merchant) {
        return common.notfound(res, "Merchant request not found");
      }

      if (email && email !== merchant.email) {
        const emailExist = await user.findOne({
          where: { email },
        });

        if (emailExist) {
          return common.failed(res, "Email already exists");
        }
      }

      let profileImage = merchant.profile_image;
      if (req.files && req.files.profile_image) {
        profileImage = await common.fileUpload(req.files.profile_image);
      }

      const hashedNewPassword = await bcrypt.hash(req.body.password, 10);

      await user.create({
        name: req.body.name,
        email: req.body.email,
        country_code: req.body.country_code,
        phone: req.body.phone,
        password: hashedNewPassword,
        description: req.body.message,
        profile_logo: profileImage,
        role: "1",
      });

      // await db.MerchantRequest.update(
      //   { deletedAt: new Date() },
      //   {
      //     where: {
      //       id: req.params.id,
      //     },
      //   },
      // );
      await merchantRequest.destroy({
        where: {
          id: req.params.id,
        },
      });

      return common.success(res, "Merchant request updated successfully", {
        data: merchant,
      });
    } catch (error) {
      console.log(error);
      return common.error(res, "Something went wrong", error.message);
    }
  },
};
