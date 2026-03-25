var express = require("express");
var router = express.Router();
const auth = require("../controller/adminController/authcontroller");
const authtoken = require("../middleware/authtoken");
const usercontroller = require("../controller/adminController/usercontroller");
const merchantController = require("../controller/adminController/merchantController");
const merchantRequestController = require("../controller/adminController/merchantRequestController");
const merchantImageController = require("../controller/adminController/merchantImageController");

const categoryController = require("../controller/adminController/categoryController");
const conciergeRequestController = require("../controller/adminController/conciergeRequestController");
const conciergePartnerController = require("../controller/adminController/conciergePartnerController");
const cashbackController = require("../controller/adminController/cashbackTransactionController");
const subscriptionController = require("../controller/adminController/subscriptionController");
const offerController = require("../controller/adminController/offerController");
const cartController = require("../controller/adminController/cartController");

const contactUsController = require("../controller/admincontroller/contactUsController");
const cmsController = require("../controller/adminController/cmsController");
const faqController = require("../controller/adminController/faqController");

router.post("/login", auth.login);
router.get("/profile", authtoken.verifyToken, auth.profile);
router.post("/updateprofile", authtoken.verifyToken, auth.edit_profile);
router.post("/updatepassword", authtoken.verifyToken, auth.reset_password);
router.post("/logout", authtoken.verifyToken, auth.logout);

router.get("/all-users", authtoken.verifyToken, auth.getAllUsers);

router.get("/dashboard", authtoken.verifyToken, auth.dashboard);
router.get("/chart", authtoken.verifyToken, auth.chartData);

// router for merchants
router.get(
  "/merchantdetail/:id",
  authtoken.verifyToken,
  usercontroller.merchantDetail,
);
router.post(
  "/merchantstatus",
  authtoken.verifyToken,
  usercontroller.merchantStatus,
);
router.post(
  "/merchantdelete/:id",
  authtoken.verifyToken,
  usercontroller.merchantDelete,
);
router.get("/merchantlist", authtoken.verifyToken, usercontroller.merchantList);

//======= route merchant request ========
router.post(
  "/createMerchant",
  authtoken.verifyToken,
  merchantRequestController.createMerchantRequest,
);
router.get(
  "/merchantreqlist",
  authtoken.verifyToken,
  merchantRequestController.getAllMerchantRequests,
);
router.get(
  "/viewDetail/:id",
  authtoken.verifyToken,
  merchantRequestController.getSingleMerchantRequest,
);
router.delete(
  "/merchantreqdelete/:id",
  authtoken.verifyToken,
  merchantRequestController.deleteMerchantRequest,
);
router.put(
  "/merchantRequeststatus/:id",
  authtoken.verifyToken,
  merchantRequestController.updateMerchantRequestStatus,
);
router.put(
  "/editMerchantRequest/:id",
  authtoken.verifyToken,
  merchantRequestController.updateMerchantRequest,
);

//router for merchants
router.post("/addMerchant", merchantController.createMerchant);
router.get("/allMerchants", merchantController.getAllMerchants);
router.get("/viewMerchant/:id", merchantController.getMerchantById);
router.put("/updateMerchant/:id", merchantController.updateMerchant);
router.delete("/deleteMerchant/:id", merchantController.deleteMerchant);

//router for merchantImage
router.post("/addMerchantImage", merchantImageController.createImage);
router.get("/allMerchantImages", merchantImageController.getAllImages);
router.get("/viewMerchantImage/:id", merchantImageController.getById);
router.put("/updateMerchantImage/:id", merchantImageController.updateImage);
router.delete("/deleteMerchantImage/:id", merchantImageController.deleteImage);

// router for concierges
router.get(
  "/conciergedetail/:id",
  authtoken.verifyToken,
  usercontroller.conciergeDetail,
);
router.post(
  "/conciergestatus",
  authtoken.verifyToken,
  usercontroller.conciergeStatus,
);
router.post(
  "/conciergedelete/:id",
  authtoken.verifyToken,
  usercontroller.conciergeDelete,
);
router.get(
  "/conciergelist",
  authtoken.verifyToken,
  usercontroller.conciergeList,
);

//======= route Concierge request ========
router.post(
  "/createConcierge",
  authtoken.verifyToken,
  conciergeRequestController.createConciergeRequest,
);
router.get(
  "/conciergereqlist",
  authtoken.verifyToken,
  conciergeRequestController.getAllConciergeRequests,
);
router.get(
  "/viewConciergeDetail/:id",
  authtoken.verifyToken,
  conciergeRequestController.getSingleConciergeRequest,
);
router.delete(
  "/conciergereqdelete/:id",
  authtoken.verifyToken,
  conciergeRequestController.deleteConciergeRequest,
);
router.put(
  "/conciergeRequeststatus/:id",
  conciergeRequestController.updateConciergeRequestStatus,
);
router.put(
  "/editConciergeRequest/:id",
  authtoken.verifyToken,
  conciergeRequestController.updateConciergeRequest,
);

// router for traveller
router.get(
  "/travellerdetail/:id",
  authtoken.verifyToken,
  usercontroller.travellerDetail,
);
router.post(
  "/travellerstatus",
  authtoken.verifyToken,
  usercontroller.travellerStatus,
);
router.post(
  "/travellerdelete/:id",
  authtoken.verifyToken,
  usercontroller.travellerDelete,
);
router.get(
  "/travellerlist",
  authtoken.verifyToken,
  usercontroller.travellerList,
);

// router for categorys
router.post(
  "/addCategory",
  // authtoken.verifyToken,
  categoryController.addCategory,
);
router.get(
  "/categoryList",
  authtoken.verifyToken,
  categoryController.getCategories,
);
router.get(
  "/category/:id",
  authtoken.verifyToken,
  categoryController.viewCategory,
);
router.put(
  "/updateCategory/:id",
  authtoken.verifyToken,
  categoryController.updateCategory,
);
router.delete(
  "/deleteCategory/:id",
  authtoken.verifyToken,
  categoryController.deleteCategory,
);

router.post(
  "/categorystatus",
  authtoken.verifyToken,
  categoryController.categoryStatus,
);

// route for concierge_partners
router.post(
  "/addConcierge",
  authtoken.verifyToken,
  conciergePartnerController.createConcierge,
);
router.get(
  "/allDetails",
  authtoken.verifyToken,
  conciergePartnerController.getAllDetails,
);
router.get(
  "/viewConcierge/:id",
  authtoken.verifyToken,
  conciergePartnerController.getById,
);
router.put(
  "/updateConcierge/:id",
  authtoken.verifyToken,
  conciergePartnerController.updateConcierge,
);
router.delete(
  "/deleteConcierge/:id",
  authtoken.verifyToken,
  conciergePartnerController.deleteConcierge,
);

// router for offers

//router for cashback
router.post("/createCashback", cashbackController.createTransaction);
router.get("/allCashbacks", cashbackController.getAllTransactions);
router.get("/cashback/:id", cashbackController.getTransactionById);
router.put("/updateCashback/:id", cashbackController.updateTransaction);
router.put("/updateCashbackStatus/:id", cashbackController.updateStatus);
router.delete("/deleteCashback/:id", cashbackController.deleteTransaction);

// router for subscriptions
router.post(
  "/addSubscription",
  authtoken.verifyToken,
  subscriptionController.createSubscription,
);
router.get(
  "/allSubscriptions",
  authtoken.verifyToken,
  subscriptionController.getAllSubscriptions,
);
router.get(
  "/viewSubscription/:id",
  authtoken.verifyToken,
  subscriptionController.getSubscriptionById,
);
router.put(
  "/updateSubscription/:id",
  authtoken.verifyToken,
  subscriptionController.updateSubscription,
);
router.delete(
  "/deleteSubscription/:id",
  authtoken.verifyToken,
  subscriptionController.deleteSubscription,
);
router.put(
  "/subscriptionstatus/:id",
  authtoken.verifyToken,
  subscriptionController.updateSubscriptionStatus,
);

// router for offers
router.post("/addOffer", authtoken.verifyToken, offerController.createOffer);
router.get("/allOffers", authtoken.verifyToken, offerController.getAllOffers);
router.get(
  "/viewOffer/:id",
  authtoken.verifyToken,
  offerController.getOfferById,
);
router.put(
  "/updateOffer/:id",
  authtoken.verifyToken,
  offerController.updateOffer,
);
router.delete(
  "/deleteOffer/:id",
  authtoken.verifyToken,
  offerController.deleteOffer,
);
router.post(
  "/offerstatus",
  authtoken.verifyToken,
  offerController.offersStatus,
);

// router for carts
router.post("/addCart", cartController.createCart);
router.get("/allCarts", cartController.getAllCarts);
router.get("/viewCart/:id", cartController.getCartById);
router.put("/updateCart/:id", cartController.updateCart);
router.put("/updateCartStatus/:id", cartController.updateStatus);
router.delete("/deleteCart/:id", cartController.deleteCart);

// router for contact us
router.get(
  "/contactList",
  authtoken.verifyToken,
  contactUsController.contactGet,
);
router.get(
  "/contactDetail/:id",
  authtoken.verifyToken,
  contactUsController.contactView,
);
router.post(
  "/contact/:id",
  authtoken.verifyToken,
  contactUsController.contactDelete,
);

// router for faq
router.post("/addFaq", authtoken.verifyToken, faqController.addFaq);
router.get("/faqList", authtoken.verifyToken, faqController.getFaqs);
router.get("/viewFaq/:id", authtoken.verifyToken, faqController.viewFaq);
router.put("/updateFaq/:id", authtoken.verifyToken, faqController.updateFaq);
router.delete("/deleteFaq/:id", authtoken.verifyToken, faqController.deleteFaq);

// router for cms
router.get(
  "/privacypolicy",
  authtoken.verifyToken,
  cmsController.privacy_policy,
);
router.post(
  "/privacypolicy",
  authtoken.verifyToken,
  cmsController.privacypolicy,
);
router.get("/aboutus", authtoken.verifyToken, cmsController.aboutus);
router.post("/aboutus", authtoken.verifyToken, cmsController.updateabout);
router.get("/termsconditions", authtoken.verifyToken, cmsController.term);
router.post(
  "/termsconditions",
  authtoken.verifyToken,
  cmsController.updateterm,
);

module.exports = router;
