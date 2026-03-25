import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  CheckSquare,
  File,
  Info,
  Phone,
  MessageSquare,
} from "react-feather";

function Sidebar({ isOpen }) {
  const [isHovered, setHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  const handleMouseEnter = () => {
    if (!isOpen) {
      setHovered(true);
      setShowButton(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isOpen) {
      setHovered(false);
      setShowButton(false);
    }
  };

  const isSidebarExpanded = isOpen || isHovered;

  const toggleMenu = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    const width = window.innerWidth;
    if (width <= 1200) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    if (pathname.startsWith("/merchant")) {
      setActiveMenu("merchant");
    } else if (pathname.startsWith("/concierge")) {
      setActiveMenu("concierge");
    } else if (pathname.startsWith("/traveller")) {
      setActiveMenu("traveller");
    } else if (
      pathname.startsWith("/addCategory") ||
      pathname.startsWith("/editCategory") ||
      pathname.startsWith("/viewCategory")
    ) {
      setActiveMenu("categorylist");
    } else if (
      pathname.startsWith("/addSubscription") ||
      pathname.startsWith("/editSubscription") ||
      pathname.startsWith("/viewSubscription")
    ) {
      setActiveMenu("subscriptionlist");
    } else if (
      pathname.startsWith("/addOffers") ||
      pathname.startsWith("/editOffers") ||
      pathname.startsWith("/viewOffers")
    ) {
      setActiveMenu("offerslist");
    } else if (
      pathname.startsWith("/addFaq") ||
      pathname.startsWith("/editFaq") ||
      pathname.startsWith("/viewFaq")
    ) {
      setActiveMenu("faqlist");
    } else if (pathname.startsWith("/cms")) {
      setActiveMenu("cms");
    } else if (
      pathname.startsWith("/commission") ||
      pathname.startsWith("/configrationsetting") ||
      pathname.startsWith("/password")
    ) {
      setActiveMenu("settings");
    } else {
      setActiveMenu(null);
    }
  }, [pathname]);
  return (
    <div
      className={`vertical-menu ${isSidebarExpanded ? "hovered" : "collapsed"}`}
      onMouseEnter={() => {
        handleMouseEnter();
        document.body.classList.add("hovered");
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        document.body.classList.remove("hovered");
      }}
    >
      <div className="navbar-brand-box">
        <Link to="/dashboard" className="logo" onClick={handleLinkClick}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="logo-lg">
              {/* <img src="/assets/images/fev1.png" alt="" height={20} /> */}
            </span>
            <h6 style={{ margin: 5, color: "black", fontSize: "26px" }}>
              Locally
            </h6>
          </div>
        </Link>
        <button
          type="button"
          className="btn btn-sm hide-menu-btn"
          onClick={() => {
            const body = document.body;
            body.classList.toggle("sidebar-enable");
            body.classList.remove("hovered");
            setHovered(false);
            setShowButton(false);

            if (window.innerWidth >= 1200) {
              body.classList.toggle("vertical-collapsed");
            } else {
              body.classList.remove("vertical-collapsed");
            }
          }}
          style={{
            display: isSidebarExpanded && showButton ? "block" : "none",
          }}
        >
          <i className="fe-x"></i>
        </button>
      </div>
      <div data-simplebar="" className="sidebar-menu-scroll mt-1">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className={isActive("/dashboard") ? "mm-active" : ""}>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <i className="ri-pie-chart-2-fill" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className={activeMenu === "merchant" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("merchant")}
              >
                {/* <i className="uil-user-square" /> */}
                <i className="uil-store" />
                <span>Merchant</span>
              </Link>
              {isSidebarExpanded && activeMenu === "merchant" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/merchantlist") ? "active" : ""}
                      to="/merchantlist"
                      onClick={handleLinkClick}
                    >
                      Merchant listings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={isActive("/merchantreqlist") ? "active" : ""}
                      to="/merchantreqlist"
                      onClick={handleLinkClick}
                    >
                      Merchant Request
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* <li className={activeMenu === "merchants" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("merchants")}
              >
                <i className="uil-user-square" />
                <span>Merchant Management</span>
              </Link>
              {isSidebarExpanded && activeMenu === "merchants" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/merchantslist") ? "active" : ""}
                      to="/merchantslist"
                      onClick={handleLinkClick}
                    >
                      Merchant Management listings
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}

            <li className={activeMenu === "concierge" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("concierge")}
              >
                <i className="uil-user-square" />
                {/* <i className="uil-concierge-bell" /> */}
                <span>Concierge</span>
              </Link>
              {isSidebarExpanded && activeMenu === "concierge" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/conciergelist") ? "active" : ""}
                      to="/conciergelist"
                      onClick={handleLinkClick}
                    >
                      Concierge listings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={isActive("/conciergereqlist") ? "active" : ""}
                      to="/conciergereqlist"
                      onClick={handleLinkClick}
                    >
                      Concierge Request
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={activeMenu === "traveller" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("traveller")}
              >
                <i className="uil-plane-departure" />
                <span>Traveller</span>
              </Link>
              {isSidebarExpanded && activeMenu === "traveller" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/travellerlist") ? "active" : ""}
                      to="/travellerlist"
                      onClick={handleLinkClick}
                    >
                      Travellers listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li
              className={
                pathname.startsWith("/categorylist") ||
                pathname.startsWith("/addCategory") ||
                pathname.startsWith("/editCategory") ||
                pathname.startsWith("/viewCategory")
                  ? "mm-active"
                  : ""
              }
            >
              {" "}
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("category")}
              >
                {/* <i className="uil-user-square" /> */}
                <i className="uil-apps" />
                <span>Category</span>
              </Link>
              {isSidebarExpanded && activeMenu === "category" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/categorylist") ? "active" : ""}
                      to="/categorylist"
                      onClick={handleLinkClick}
                    >
                      Category listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={
                pathname.startsWith("/subscriptionlist") ||
                pathname.startsWith("/addSubscription") ||
                pathname.startsWith("/editSubscription") ||
                pathname.startsWith("/viewSubscription")
                  ? "mm-active"
                  : ""
              }
            >
              {" "}
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("subscription")}
              >
                <i className="uil-credit-card" />
                <span>Subscriptions</span>
              </Link>
              {isSidebarExpanded && activeMenu === "subscription" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/subscriptionlist") ? "active" : ""}
                      to="/subscriptionlist"
                      onClick={handleLinkClick}
                    >
                      Subscription listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={
                pathname.startsWith("/offerslist") ||
                pathname.startsWith("/addOffers") ||
                pathname.startsWith("/editOffers") ||
                pathname.startsWith("/viewOffers")
                  ? "mm-active"
                  : ""
              }
            >
              {" "}
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("offer")}
              >
                <i className="fa-solid fa-tags"></i>
                <span>Offers</span>
              </Link>
              {isSidebarExpanded && activeMenu === "offer" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/offerslist") ? "active" : ""}
                      to="/offerslist"
                      onClick={handleLinkClick}
                    >
                      Offers listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isActive("/contactlist") ? "mm-active" : ""}>
              <Link to="/contactlist" onClick={handleLinkClick}>
                <Phone />
                <span>Inquiry</span>
              </Link>
            </li>
            <li
              className={
                pathname.startsWith("/faqlist") ||
                pathname.startsWith("/addFaq") ||
                pathname.startsWith("/editFaq") ||
                pathname.startsWith("/viewFaq")
                  ? "mm-active"
                  : ""
              }
            >
              <Link to="/faqlist" onClick={handleLinkClick}>
                <MessageSquare />
                <span>Faqs</span>
              </Link>
            </li>
            <li className={isActive("/aboutus") ? "mm-active" : ""}>
              <Link to="/aboutus" onClick={handleLinkClick}>
                <Info />
                <span>About Us</span>
              </Link>
            </li>

            <li className={isActive("/privacypolicy") ? "mm-active" : ""}>
              <Link to="/privacypolicy" onClick={handleLinkClick}>
                <File />
                <span>Privacy Policy</span>
              </Link>
            </li>

            <li className={isActive("/termsConditions") ? "mm-active" : ""}>
              <Link to="/termsConditions" onClick={handleLinkClick}>
                <CheckSquare />
                <span>Terms & Conditions</span>
              </Link>
            </li>

            <li className={activeMenu === "settings" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("settings")}
              >
                <i className="uil-setting" />
                <span>Settings</span>
              </Link>
              {isSidebarExpanded && activeMenu === "settings" && (
                <ul className="sub-menu mm-show">
                  {/* <li>
                    <Link
                      className={isActive("/merchantlist") ? "active" : ""}
                      to="/merchantlist"
                      onClick={handleLinkClick}
                    >
                      Cashback
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      className={isActive("/commissionlist") ? "active" : ""}
                      to="/commissionlist"
                      onClick={handleLinkClick}
                    >
                      Commission
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      className={isActive("/subscriptionlist") ? "active" : ""}
                      to="/subscriptionlist"
                      onClick={handleLinkClick}
                    >
                      Subscription
                    </Link>
                  </li> */}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
