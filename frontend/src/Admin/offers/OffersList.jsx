import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { axiosInstance } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const OffersList = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOffers, setSelectedOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const limit = 10;

  const dateFilters = [
    { value: "all", label: "All Data" },
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "This Month" },
    { value: "180", label: "Last 6 Months" },
    { value: "365", label: "Last Year" },
  ];

  useEffect(() => {
    fetchOffers(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const fetchOffers = async (page, search = "", filter = "all") => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/allOffers?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );

      console.log("API RESPONSE:", response.data);

      if (response.data.success) {
        const offersData = response.data.body || [];

        setOffers(offersData);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const deleteOffersHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deleteOffer/${id}`);

        const response = await axiosInstance.get(
          `/allOffers?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchTerm,
          )}&dateFilter=${dateFilter}`,
        );

        if (response.data.success) {
          const newTotalPages = response.data.body.totalPages;
          const newData = response.data.body;

          if (newData.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            setOffers(newData);
            setTotalPages(newTotalPages);
          }
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting offer",
          "error",
        );
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "inactive" ? "active" : "inactive";
      await axiosInstance.post("/offerstatus", {
        id,
        status: newStatus,
      });

      setOffers(
        offers.map((offer) =>
          offer.id === id ? { ...offer, status: newStatus } : offer,
        ),
      );

      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleViewDetails = (offer) => {
    setSelectedOffers(offer);
  };

  const getCurrentFilterLabel = () => {
    const filter = dateFilters.find((f) => f.value === dateFilter);
    return filter ? filter.label : "All Data";
  };

  const prepareDataForExport = () => {
    return offers.map((offer) => ({
      "Merchant Name": offer.user?.name || "",
      Title: offer.title || "",
      Description: offer.description || "",
      Discount_details: offer.discount_details || "",
      terms_conditions: offer.terms_conditions || "",
      "Start Date": offer.start_date || "",
      "End Date": `${offer.end_date || ""}`,
      Status: `${offer.status || ""}`,
    }));
  };

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(prepareDataForExport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "offers");

    XLSX.writeFile(workbook, "offers.xlsx");
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Offer List</h4>
                <Link to="/addOffers" className="btn btn-primary btn-sm">
                  Add offer
                </Link>
              </div>
              <div>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard" className="new">
                        <i className="ri-home-4-fill me-1 new" /> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/" className="new">
                        <i className="ri-group-2-line me-1 new" /> Offers
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      offer Listings
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body cusbar">
                  <div
                    className="card-head mb-3 d-flex justify-content-between align-items-center"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <div className="d-flex">
                      <div className="tbl-search position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line" />
                      </div>

                      <div className="dropdown tbl-drop mb-3">
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {getCurrentFilterLabel()}
                        </button>
                        <ul className="dropdown-menu">
                          {dateFilters.map((filter) => (
                            <li key={filter.value}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => handleDateFilter(filter.value)}
                              >
                                {filter.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex">
                      <CSVLink
                        data={prepareDataForExport()}
                        filename={"offers.csv"}
                        className="btn btn-success me-2"
                      >
                        Export to CSV
                      </CSVLink>
                      <button
                        className="btn btn-danger"
                        onClick={handleExcelExport}
                      >
                        Export to Excel
                      </button>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive table-card border-top">
                        <div data-simplebar="" className="cus-scroll scmob">
                          <table className="table table-centered cus-nowrap align-middle hltr mb-0">
                            <thead>
                              <tr>
                                <th>Sr no.</th>
                                <th>Merchant Name</th>
                                <th>Title</th>
                                {/* <th>Description</th>
                                <th>Discount Details</th>
                                <th>Terms Conditions</th> */}
                                {/* <th>Start Date</th>
                                <th>End Date </th> */}
                                <th>Status</th>
                                <th className="text-end">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {offers.length > 0 ? (
                                offers.map((offer, index) => (
                                  <tr key={offer.id}>
                                    <td>
                                      {(currentPage - 1) * limit + index + 1}
                                    </td>
                                    <td>{offer.user?.name || ""}</td>
                                    <td>{offer.title || ""}</td>
                                    {/* <td>{offer.description || ""}</td>
                                    <td>{offer.discount_details || ""}</td>
                                    <td>{offer.terms_conditions || ""}</td> */}
                                    {/* <td>{offer.start_date || ""}</td>
                                    <td>{offer.end_date || ""}</td> */}
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`toggleStatus${offer.id}`}
                                          checked={offer.status === "active"}
                                          onChange={() =>
                                            toggleStatus(offer.id, offer.status)
                                          }
                                          style={{
                                            backgroundColor:
                                              offer.status === "active"
                                                ? "#2dbb58"
                                                : "lightgray",
                                            borderColor:
                                              offer.status === "active"
                                                ? "#2dbb58"
                                                : "lightgray",
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-end">
                                        <button
                                          type="button"
                                          className="btn btn-soft-primary px-2 btn-sm me-1"
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#view-details"
                                          aria-controls="offcanvasRight"
                                          onClick={() =>
                                            handleViewDetails(offer)
                                          }
                                        >
                                          <i className="ri-eye-fill font-size-16"></i>
                                        </button>
                                        <button
                                          className="btn btn-warning btn-sm me-1"
                                          onClick={() =>
                                            navigate(`/editOffers/${offer.id}`)
                                          }
                                        >
                                          <i className="ri-edit-line text-white"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            deleteOffersHandler(offer.id)
                                          }
                                          className="btn btn-soft-danger px-2 btn-sm"
                                          style={{
                                            backgroundColor: "#ea5455",
                                            borderColor: "#ea5455",
                                            color: "#fff",
                                          }}
                                          title="Delete offer"
                                        >
                                          <i className="ri-delete-bin-line font-size-16"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="7"
                                    style={{
                                      textAlign: "center",
                                      padding: "20px",
                                    }}
                                  >
                                    No offers found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <div className="d-flex justify-content-center align-items-center mt-3">
                            <Stack
                              spacing={2}
                              className="d-flex justify-content-center mt-3"
                            >
                              <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="error"
                              />
                            </Stack>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* offer Details Offcanvas - Keep this section exactly as it was */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <h5
                className="offcanvas-title mb-0 me-3 fw-semibold"
                id="offcanvasRightLabel"
              >
                Offers Details
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedOffers ? (
            <>
              <div>
                <div className="border-bottom mb-2 pb-1">
                  <h5 className="fw-semibold font-size-17 mb-1">
                    {selectedOffers.user?.name || "No Name"}
                  </h5>
                </div>
              </div>
              <div className="font-size-16 fw-medium pt-3 mt-1 mb-2">
                Offer Information
              </div>
              <table
                className="table table-borderless"
                style={{ marginLeft: "-8px" }}
              >
                <tbody>
                  <tr>
                    <td>offer ID:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.id}
                    </td>
                  </tr>
                  <tr>
                    <td>Merchant Name:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.user?.name || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Title:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.title || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Description:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.description || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Discount Details:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.discount_details || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Terms Conditions:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.terms_conditions || ""}
                    </td>
                  </tr>

                  <tr>
                    <td>Start Date:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers.start_date || ""}
                    </td>
                  </tr>

                  <tr>
                    <td>End Date :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedOffers?.end_date || ""}
                    </td>
                  </tr>

                  <tr>
                    <td>Status:</td>
                    <td className="text-end text-black fw-medium">
                      <p className="fw-medium">
                        {selectedOffers?.status || "N/A"}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-offer-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No offer selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OffersList;
