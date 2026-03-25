var DataTypes = require("sequelize").DataTypes;
var _carts = require("./carts");
var _cashback_transactions = require("./cashback_transactions");
var _categories = require("./categories");
var _chatconstant = require("./chatconstant");
var _cms = require("./cms");
var _concierge_partners = require("./concierge_partners");
// var _contact_support = require("./contact_support");
var _faqs = require("./faqs");
var _inquiries = require("./inquiries");
var _merchant_images = require("./merchant_images");
var _merchants = require("./merchants");
var _messages = require("./messages");
var _notifications = require("./notifications");
var _offers = require("./offers");
var _ratings = require("./ratings");
var _redemptions = require("./redemptions");
var _report_exports = require("./report_exports");
var _sessions = require("./sessions");
var _static_home_content = require("./static_home_content");
var _subscriptions = require("./subscriptions");
var _traveler_sessions = require("./traveler_sessions");
var _users = require("./users");
var _website_static_content = require("./website_static_content");

function initModels(sequelize) {
  var carts = _carts(sequelize, DataTypes);
  var cashback_transactions = _cashback_transactions(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var chatconstant = _chatconstant(sequelize, DataTypes);
  var cms = _cms(sequelize, DataTypes);
  var concierge_partners = _concierge_partners(sequelize, DataTypes);
  // var contact_support = _contact_support(sequelize, DataTypes);
  var faqs = _faqs(sequelize, DataTypes);
  var inquiries = _inquiries(sequelize, DataTypes);
  var merchant_images = _merchant_images(sequelize, DataTypes);
  var merchants = _merchants(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var offers = _offers(sequelize, DataTypes);
  var ratings = _ratings(sequelize, DataTypes);
  var redemptions = _redemptions(sequelize, DataTypes);
  var report_exports = _report_exports(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var static_home_content = _static_home_content(sequelize, DataTypes);
  var subscriptions = _subscriptions(sequelize, DataTypes);
  var traveler_sessions = _traveler_sessions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var website_static_content = _website_static_content(sequelize, DataTypes);

  messages.belongsTo(chatconstant, {
    as: "chatConstant",
    foreignKey: "chatConstantId",
  });
  chatconstant.hasMany(messages, {
    as: "messages",
    foreignKey: "chatConstantId",
  });
  chatconstant.belongsTo(users, { as: "sender", foreignKey: "senderId" });
  users.hasMany(chatconstant, { as: "chatconstants", foreignKey: "senderId" });
  chatconstant.belongsTo(users, { as: "receiver", foreignKey: "receiverId" });
  users.hasMany(chatconstant, {
    as: "receiver_chatconstants",
    foreignKey: "receiverId",
  });
  messages.belongsTo(users, { as: "sender", foreignKey: "senderId" });
  users.hasMany(messages, { as: "messages", foreignKey: "senderId" });
  messages.belongsTo(users, { as: "receiver", foreignKey: "receiverId" });
  users.hasMany(messages, {
    as: "receiver_messages",
    foreignKey: "receiverId",
  });
  sessions.belongsTo(users, { as: "user", foreignKey: "userId" });
  users.hasMany(sessions, { as: "sessions", foreignKey: "userId" });

  return {
    carts,
    cashback_transactions,
    categories,
    chatconstant,
    cms,
    concierge_partners,
    // contact_support,
    faqs,
    inquiries,
    merchant_images,
    merchants,
    messages,
    notifications,
    offers,
    ratings,
    redemptions,
    report_exports,
    sessions,
    static_home_content,
    subscriptions,
    traveler_sessions,
    users,
    website_static_content,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
