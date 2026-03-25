import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { axiosInstance, BASE_URL } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const ConciergeList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [concierge, setConcierge] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [dateFilter, setDateFilter] = useState("all");

  const dateFilters = [
    { value: "all", label: "All Data" },
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "This Month" },
    { value: "180", label: "Last 6 Months" },
    { value: "365", label: "Last Year" },
  ];

  useEffect(() => {
    fetchconcierge(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const fetchconcierge = async (page, search = "", filter = "all") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/conciergelist?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );
      if (response.data.success) {
        setConcierge(response.data.body.data || []);
        setTotalPages(response.data.body.totalPages || 1);
      } else {
        setConcierge([]);
        setTotalPages(0);
      }
    } catch (error) {
      setConcierge([]);
      setTotalPages(0);
    } finally {
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

  const deleteConciergeHandler = async (id) => {
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
        setLoading(true);
        await axiosInstance.post(`/conciergedelete/${id}`);

        const response = await axiosInstance.get(
          `/conciergelist?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchTerm,
          )}&dateFilter=${dateFilter}`,
        );

        if (response.data.success) {
          const newTotalPages = response.data.body.totalPages;
          const newData = response.data.body.data;

          if (newData.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            setConcierge(newData);
            setTotalPages(newTotalPages);
          }
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting concierge",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "0" ? "1" : "0";
      await axiosInstance.post("/conciergestatus", {
        id,
        status: newStatus,
      });

      setConcierge((prevconcierge) =>
        prevconcierge.map((concierge) =>
          concierge.id === id ? { ...concierge, status: newStatus } : concierge,
        ),
      );

      if (selectedUser && selectedUser.id === id) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }

      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleViewDetails = (concierge) => {
    setSelectedUser({
      ...concierge,
      sessions: concierge.sessions || [],
    });
  };

  const getCurrentFilterLabel = () => {
    const filter = dateFilters.find((f) => f.value === dateFilter);
    return filter ? filter.label : "All Data";
  };

  const getSerialNumber = (index) => {
    return (currentPage - 1) * limit + index + 1;
  };

  const prepareDataForExport = () => {
    return concierge.map((concierges) => ({
      Name: concierges.name || "",
      Email: concierges.email || "",
      "Mobile Number": `${concierges.country_code || ""} ${concierges.phone || ""}`,
    }));
  };

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(prepareDataForExport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "concierge");

    XLSX.writeFile(workbook, "concierge.xlsx");
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 page-title">Concierge List</h4>
                {/* <Link to="/addAgent" className="btn btn-primary btn-sm">
                  <i className="ri-add-line me-1"></i> Add Agent
                </Link> */}
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
                        <i className="ri-group-2-line me-1 new" /> Concierges
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Concierge Listings
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
                        filename={"concierge.csv"}
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
                    <div className="table-responsive table-card border-top">
                      <div data-simplebar="" className="cus-scroll scmob">
                        <table className="table table-centered cus-nowrap align-middle hltr mb-0">
                          <thead>
                            <tr>
                              <th>Sr no.</th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {concierge.length > 0 ? (
                              concierge.map((concierge, index) => (
                                <tr key={concierge.id}>
                                  <td>{getSerialNumber(index)}</td>
                                  <td>
                                    {concierge.profile_logo ? (
                                      <a
                                        href={`${BASE_URL}/${concierge.profile_logo}`}
                                        data-fancybox="user-gallery"
                                        data-caption={
                                          concierge.name || "Concierge Image"
                                        }
                                        className="d-inline-block"
                                      >
                                        <img
                                          src={`${BASE_URL}/${concierge.profile_logo}`}
                                          alt="Concierge"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            objectFit: "cover",
                                          }}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                              "https://via.placeholder.com/50";
                                          }}
                                        />
                                      </a>
                                    ) : (
                                      <div
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "50%",
                                          backgroundColor: "#f8f9fa",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <i className="ri-user-line text-muted"></i>
                                      </div>
                                    )}
                                  </td>
                                  <td>{concierge.name || "N/A"}</td>
                                  <td>{concierge.email || "N/A"}</td>
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`toggleStatus${concierge.id}`}
                                        checked={concierge.status === "1"}
                                        onChange={() =>
                                          toggleStatus(
                                            concierge.id,
                                            concierge.status,
                                          )
                                        }
                                        style={{
                                          backgroundColor:
                                            concierge.status === "1"
                                              ? "#2dbb58"
                                              : "#e9ecef",
                                          borderColor:
                                            concierge.status === "1"
                                              ? "#2dbb58"
                                              : "#e9ecef",
                                          cursor: "pointer",
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
                                          handleViewDetails(concierge)
                                        }
                                        title="View Details"
                                      >
                                        <i className="ri-eye-fill font-size-16"></i>
                                      </button>

                                      <button
                                        onClick={() =>
                                          deleteConciergeHandler(concierge.id)
                                        }
                                        className="btn btn-soft-danger px-2 btn-sm"
                                        style={{
                                          backgroundColor: "#ea5455",
                                          borderColor: "#ea5455",
                                          color: "#fff",
                                        }}
                                        title="Delete Concierge"
                                      >
                                        <i className="ri-delete-bin-line font-size-16"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center py-2">
                                  <p className="text-muted">
                                    No concierges found
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {totalPages > 1 && (
                          <div className="d-flex justify-content-center align-items-center mt-3">
                            <Stack spacing={2}>
                              <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="error"
                                showFirstButton
                                showLastButton
                              />
                            </Stack>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas for concierge Details */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="offcanvas-title mb-0 fw-semibold">
              Concierge Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedUser ? (
            <>
              <div className="scroll-room mb-3" id="scrollRoom">
                <label className="text-muted small">Profile</label>

                {selectedUser.profile_logo ? (
                  <a
                    href={`${BASE_URL}/${selectedUser.profile_logo}`}
                    data-fancybox="gallery"
                    className="image-popup-gallery-item"
                  >
                    <img
                      src={`${BASE_URL}/${selectedUser.profile_logo}`}
                      className="img-fluid rounded"
                      alt="Concierge"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300";
                      }}
                    />
                  </a>
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <i className="ri-user-line font-size-48 text-muted"></i>
                  </div>
                )}
              </div>

              <div className="border-bottom mb-3 pb-3">
                <label className="text-muted small">Name</label>
                <h5 className="fw-semibold mb-2">
                  {selectedUser.name || "No Name"}
                </h5>
                <div className="d-flex align-items-center">
                  <label className="text-muted small">Status : </label>

                  <span
                    className={`badge ${selectedUser.status === "1" ? "bg-success" : "bg-danger"}`}
                  >
                    {selectedUser.status === "1" ? "Active" : "Inactive"}
                  </span>
                  <span className="mx-2 text-muted">•</span>
                  <small className="text-muted">
                    Member Since:{" "}
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </small>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Personal Information</h6>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small">Concierge ID</label>
                    <p className="fw-medium">{selectedUser.id}</p>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Email</label>
                    <p className="fw-medium">{selectedUser.email || "N/A"}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Phone</label>
                    <p className="fw-medium">
                      {selectedUser?.country_code
                        ? `${selectedUser.country_code} `
                        : ""}
                      {selectedUser?.phone || "N/A"}
                    </p>
                  </div>
                  {/* <div className="col-6">
                    <label className="text-muted small">Location</label>
                    <p className="fw-medium">
                      {selectedUser?.location || "N/A"}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* <div className="mb-4">
                <h6 className="fw-semibold mb-3">Bio</h6>
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <p className="mb-0">
                      {selectedUser.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </div> */}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No Concierge selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConciergeList;
