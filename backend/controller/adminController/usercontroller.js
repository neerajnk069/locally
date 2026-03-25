const db = require("../../models");
const helper = require("../../helper/helper");
const { Op, Model } = require("sequelize");

db.sessions.belongsTo(db.users, { foreignKey: "userId", as: "sessions" });
db.users.hasMany(db.sessions, { foreignKey: "userId", as: "sessions" });
module.exports = {
  merchantList: async (req, res) => {
    try {
      let { page, limit, search, dateFilter } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      dateFilter = dateFilter || "all";

      const Op = db.Sequelize.Op;
      const whereCondition = { role: "1" };

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

      // if (deviceType && deviceType !== "all") {
      //   whereCondition.deviceType = deviceType;
      // }

      const { count, rows } = await db.users.findAndCountAll({
        where: whereCondition,
        distinct: true,
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All users detail.", {
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
      });
      // return res
      //   .status(200)
      //   .json({ status: "200", message: "All users Details", data: rows });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  merchantDetail: async (req, res) => {
    try {
      let view = await db.users.findOne({ where: { id: req.params.id } });
      return helper.success(res, "data", view);
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  merchantStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      const user = await db.users.findOne({ where: { id } });
      await db.users.update({ status }, { where: { id } });
      const updatedUser = await db.users.findOne({ where: { id } });
      return helper.success(res, "User status updated successfully", {
        id: updatedUser.id,
        status: updatedUser.status,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  merchantDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.users.findOne({ where: { id } });

      if (!user) {
        return helper.failed(res, "User not found", 404);
      }
      await db.users.destroy({ where: { id } });
      return helper.success(res, "User deleted successfully");
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },

  conciergeList: async (req, res) => {
    try {
      let { page, limit, search, dateFilter } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      dateFilter = dateFilter || "all";
      // deviceType = deviceType || "";
      // productId = productId || null;

      const Op = db.Sequelize.Op;
      const whereCondition = { role: "2" };

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

      // if (deviceType && deviceType !== "all") {
      //   whereCondition.deviceType = deviceType;
      // }

      const { count, rows } = await db.users.findAndCountAll({
        where: whereCondition,
        distinct: true,
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All users detail.", {
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  conciergeDetail: async (req, res) => {
    try {
      let view = await db.users.findOne({ where: { id: req.params.id } });
      return helper.success(res, "data", view);
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  conciergeStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      const user = await db.users.findOne({ where: { id } });
      await db.users.update({ status }, { where: { id } });
      const updatedUser = await db.users.findOne({ where: { id } });
      return helper.success(res, "User status updated successfully", {
        id: updatedUser.id,
        status: updatedUser.status,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  conciergeDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.users.findOne({ where: { id } });

      if (!user) {
        return helper.failed(res, "User not found", 404);
      }
      await db.users.destroy({ where: { id } });
      return helper.success(res, "User deleted successfully");
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },

  travellerList: async (req, res) => {
    try {
      let { page, limit, search, dateFilter } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      dateFilter = dateFilter || "all";

      const Op = db.Sequelize.Op;
      const whereCondition = { role: "3" };

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

      const { count, rows } = await db.users.findAndCountAll({
        where: whereCondition,
        distinct: true,
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All users detail.", {
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  travellerDetail: async (req, res) => {
    try {
      let view = await db.users.findOne({ where: { id: req.params.id } });
      return helper.success(res, "data", view);
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  travellerStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      const user = await db.users.findOne({ where: { id } });
      await db.users.update({ status }, { where: { id } });
      const updatedUser = await db.users.findOne({ where: { id } });
      return helper.success(res, "User status updated successfully", {
        id: updatedUser.id,
        status: updatedUser.status,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  travellerDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.users.findOne({ where: { id } });

      if (!user) {
        return helper.failed(res, "User not found", 404);
      }
      await db.users.destroy({ where: { id } });
      return helper.success(res, "User deleted successfully");
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
};
