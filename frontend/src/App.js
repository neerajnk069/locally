import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoInternet from "./NoInternet";
import Login from "./Admin/Login";
import Dashboard from "./Admin/Dashboard";
import Layout from "./Admin/common/Layout";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Admin/Profile";
import Password from "./Admin/Password";
import ContactList from "./Admin/contactUs/ContactUs";
import PrivacyPolicy from "./Admin/cms/PrivacyPolicy";
import AboutUs from "./Admin/cms/AboutUs";
import TermsConditions from "./Admin/cms/TermsConditions";
import MerchantList from "./Admin/users/MerchantList";
import MerchantRequestList from "./Admin/users/MerchantRequestList";
import MerchantsList from "./Admin/merchants/MerchantsList";
import AddMerchant from "./Admin/merchants/AddMerchant";
import EditMerchant from "./Admin/merchants/EditMerchant";
import Conciergelist from "./Admin/users/Concierge";
import ConciergeRequestList from "./Admin/users/ConciergeRequestList";
import NotificationSend from "./Admin/notifications/NotificationSend";
import Chat from "./Admin/chat/Chat";
import { SocketProvider } from "./Admin/context/SocketContext";
import { ToastContainer } from "react-toastify";
import { initOffcanvasBackButtonHandler } from "./Config";
import FaqList from "./Admin/faq/FaqList";
import AddFaq from "./Admin/faq/AddFaq";
import EditFaq from "./Admin/faq/EditFaq";
import ViewFaq from "./Admin/faq/ViewFaq";
import CategoryList from "./Admin/categorys/CategoryList";
import AddCategory from "./Admin/categorys/AddCategory";
import EditCategory from "./Admin/categorys/EditCategory";
import ViewCategory from "./Admin/categorys/ViewCategory";
import TravellerList from "./Admin/users/TravellerList";
import EditMerchantRequest from "./Admin/users/EditMerchantRequest";
import EditConciergeRequest from "./Admin/users/EditConciergeRequest";
import SubscriptionList from "./Admin/subscriptions/SubscriptionList";
import AddSubscription from "./Admin/subscriptions/AddSubscription";
import EditSubscription from "./Admin/subscriptions/EditSubscription";
import OffersList from "./Admin/offers/OffersList";
import AddOffers from "./Admin/offers/AddOffers";
import EditOffers from "./Admin/offers/EditOffers";
const App = () => {
  const isAuthenticated = localStorage.getItem("token");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const cleanup = initOffcanvasBackButtonHandler();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      cleanup();
    };
  }, []);

  if (!isOnline) {
    return <NoInternet />;
  }
  return (
    <>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute element={<Profile />} />}
              />
              <Route
                path="/password"
                element={<PrivateRoute element={<Password />} />}
              />
              <Route
                path="/merchantlist"
                element={<PrivateRoute element={<MerchantList />} />}
              />
              <Route
                path="/merchantreqlist"
                element={<PrivateRoute element={<MerchantRequestList />} />}
              />
              <Route
                path="/editMerchantRequest/:id"
                element={<PrivateRoute element={<EditMerchantRequest />} />}
              />
              <Route
                path="/merchantsList"
                element={<PrivateRoute element={<MerchantsList />} />}
              />
              <Route
                path="/merchant/add"
                element={<PrivateRoute element={<AddMerchant />} />}
              />
              <Route
                path="/merchant/edit/:id"
                element={<PrivateRoute element={<EditMerchant />} />}
              />
              <Route
                path="/conciergelist"
                element={<PrivateRoute element={<Conciergelist />} />}
              />
              <Route
                path="/conciergereqlist"
                element={<PrivateRoute element={<ConciergeRequestList />} />}
              />
              <Route
                path="/editConciergeRequest/:id"
                element={<PrivateRoute element={<EditConciergeRequest />} />}
              />
              <Route
                path="/travellerlist"
                element={<PrivateRoute element={<TravellerList />} />}
              />
              <Route
                path="/categorylist"
                element={<PrivateRoute element={<CategoryList />} />}
              />
              <Route
                path="/addCategory"
                element={<PrivateRoute element={<AddCategory />} />}
              />
              <Route
                path="/editCategory/:id"
                element={<PrivateRoute element={<EditCategory />} />}
              />
              <Route
                path="/viewCategory/:id"
                element={<PrivateRoute element={<ViewCategory />} />}
              />
              <Route
                path="/subscriptionlist"
                element={<PrivateRoute element={<SubscriptionList />} />}
              />
              <Route
                path="/addSubscription"
                element={<PrivateRoute element={<AddSubscription />} />}
              />
              <Route
                path="/editSubscription/:id"
                element={<PrivateRoute element={<EditSubscription />} />}
              />
              <Route
                path="/offerslist"
                element={<PrivateRoute element={<OffersList />} />}
              />
              console.log(OffersList);
              <Route
                path="/addOffers"
                element={<PrivateRoute element={<AddOffers />} />}
              />
              <Route
                path="/editOffers/:id"
                element={<PrivateRoute element={<EditOffers />} />}
              />
              <Route
                path="/contactlist"
                element={<PrivateRoute element={<ContactList />} />}
              />
              <Route
                path="/faqlist"
                element={<PrivateRoute element={<FaqList />} />}
              />
              <Route
                path="/addFaq"
                element={<PrivateRoute element={<AddFaq />} />}
              />
              <Route
                path="/editFaq/:id"
                element={<PrivateRoute element={<EditFaq />} />}
              />
              <Route
                path="/viewFaq/:id"
                element={<PrivateRoute element={<ViewFaq />} />}
              />
              <Route
                path="/privacypolicy"
                element={<PrivateRoute element={<PrivacyPolicy />} />}
              />
              <Route
                path="/aboutus"
                element={<PrivateRoute element={<AboutUs />} />}
              />
              <Route
                path="/termsConditions"
                element={<PrivateRoute element={<TermsConditions />} />}
              />
              <Route
                path="/notification"
                element={<PrivateRoute element={<NotificationSend />} />}
              />
              <Route
                path="/chat"
                element={<PrivateRoute element={<Chat />} />}
              />
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
      <ToastContainer />
    </>
  );
};

export default App;
