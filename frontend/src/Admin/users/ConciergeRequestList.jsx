import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { axiosInstance, BASE_URL } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const ConciergeRequestList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConcierge, setSelectedConcierge] = useState(null);
  const [conciergereq, setConciergereq] = useState([]);
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
    fetchConciergeReq(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const fetchConciergeReq = async (page, search = "", filter = "all") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/conciergereqlist?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );
      if (response.data.success) {
        setConciergereq(response.data.body.data || []);
        setTotalPages(response.data.body.totalPages || 1);
      } else {
        setConciergereq([]);
        setTotalPages(0);
      }
    } catch (error) {
      setConciergereq([]);
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

  const deleteConciergeReqHandler = async (id) => {
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
        await axiosInstance.delete(`/conciergereqdelete/${id}`);

        const response = await axiosInstance.get(
          `/conciergereqlist?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchTerm,
          )}&dateFilter=${dateFilter}`,
        );

        if (response.data.success) {
          const newTotalPages = response.data.body.totalPages;
          const newData = response.data.body.data;

          if (newData.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            setConciergereq(newData);
            setTotalPages(newTotalPages);
          }
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting conciergereq",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // const toggleStatus = async (id, currentStatus) => {
  //   try {
  //     const newStatus = currentStatus === "0" ? "1" : "0";
  //     await axiosInstance.post("/conciergereqstatus", {
  //       id,
  //       status: newStatus,
  //     });

  //     setConciergereq((prevconciergereq) =>
  //       prevconciergereq.map((conciergereq) =>
  //         conciergereq.id === id
  //           ? { ...conciergereq, status: newStatus }
  //           : conciergereq,
  //       ),
  //     );

  //     if (selectedConcierge && selectedConcierge.id === id) {
  //       setSelectedConcierge((prev) => ({ ...prev, status: newStatus }));
  //     }

  //     toast.success("Status updated successfully.");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to update status.");
  //   }
  // };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`conciergeRequeststatus/${id}`, { status });

      setConciergereq((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = (conciergereq) => {
    setSelectedConcierge({
      ...conciergereq,
      sessions: conciergereq.sessions || [],
    });
  };

  const getCurrentFilterLabel = () => {
    const filter = dateFilters.find((f) => f.value === dateFilter);
    return filter ? filter.label : "All Data";
  };

  const getSerialNumber = (index) => {
    return (currentPage - 1) * limit + index + 1;
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 page-title">Concierge Request List</h4>
                {/* <Link to="/add" className="btn btn-primary btn-sm">
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
                        <i className="ri-group-2-line me-1 new" /> Concierge
                        Requests
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Concierge Request Listings
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body cusbar">
                  <div
                    className="card-head justify-content-start adjusttwo mb-3"
                    style={{ flexWrap: "nowrap" }}
                  >
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
                              <th>Business Name</th>
                              <th>Email</th>
                              <th>Phone Number</th>
                              <th>Business Category</th>
                              <th>Business Address</th>
                              <th>Brief Description</th>
                              <th>Status</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {conciergereq.length > 0 ? (
                              conciergereq.map((conciergereq, index) => (
                                <tr key={conciergereq.id}>
                                  <td>{getSerialNumber(index)}</td>
                                  <td>{conciergereq.name || "N/A"}</td>
                                  <td>{conciergereq.email || "N/A"}</td>
                                  <td>{conciergereq.phone || "N/A"}</td>
                                  {/* <td>{conciergereq.category || "N/A"}</td> */}
                                  <td>
                                    {conciergereq.category?.english_title ||
                                      "N/A"}
                                  </td>
                                  <td>{conciergereq.address || "N/A"}</td>
                                  <td>{conciergereq.description || "N/A"}</td>

                                  <td>
                                    <select
                                      className="form-select"
                                      value={conciergereq.status}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          conciergereq.id,
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="approved">Approved</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
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
                                          handleViewDetails(conciergereq)
                                        }
                                        title="View Details"
                                      >
                                        <i className="ri-eye-fill font-size-16"></i>
                                      </button>
                                      <button
                                        className="btn btn-warning btn-sm me-1"
                                        onClick={() =>
                                          navigate(
                                            `/editConciergeRequest/${conciergereq.id}`,
                                          )
                                        }
                                      >
                                        <i className="ri-edit-line text-white"></i>
                                      </button>

                                      <button
                                        onClick={() =>
                                          deleteConciergeReqHandler(
                                            conciergereq.id,
                                          )
                                        }
                                        className="btn btn-soft-danger px-2 btn-sm"
                                        style={{
                                          backgroundColor: "#ea5455",
                                          borderColor: "#ea5455",
                                          color: "#fff",
                                        }}
                                        title="Delete conciergereq"
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
                                    No Concierge request found
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

      {/* Offcanvas for conciergereq Details */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="offcanvas-title mb-0 fw-semibold">
              Concierge Request Details
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
          {selectedConcierge ? (
            <>
              <div className="border-bottom mb-3 pb-3">
                <label className="text-muted small">Business Name</label>
                <h5 className="fw-semibold mb-2">
                  {selectedConcierge.name || "No Name"}
                </h5>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Personal Information</h6>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small">
                      Concierge Request ID
                    </label>
                    <p className="fw-medium">{selectedConcierge.id}</p>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Email</label>
                    <p className="fw-medium">
                      {selectedConcierge.email || "N/A"}
                    </p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Phone Number</label>
                    <p className="fw-medium">
                      {selectedConcierge?.country_code
                        ? `${selectedConcierge.country_code} `
                        : ""}
                      {selectedConcierge?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Business Category</h6>
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <p className="mb-0">
                      {/* {selectedConcierge.category || "No bio available"} */}
                      {selectedConcierge.category?.english_title ||
                        "No category available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Business Address</h6>
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <p className="mb-0">
                      {selectedConcierge.address || "No address available"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Brief Description</h6>
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <p className="mb-0">
                      {selectedConcierge.description ||
                        "No description available"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Status</h6>
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <p className="mb-0">
                      {selectedConcierge.status || "No status available"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No conciergereq selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConciergeRequestList;
