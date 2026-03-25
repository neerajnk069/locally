import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categoryList");
      if (res.data.success) setCategories(res.data.body || []);
    } catch (err) {
      console.log("Fetch Categories Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deleteCategory/${id}`);
        setCategories(categories.filter((c) => c.id !== id));
        Swal.fire("Deleted!", "Category deleted successfully.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.english_title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (cat.french_title || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "inactive" ? "active" : "inactive";
      const res = await axiosInstance.post("/categorystatus", {
        id,
        status: newStatus,
      });

      if (res.data.success) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === id ? { ...category, status: newStatus } : category,
          ),
        );

        toast.success("Status updated successfully.");
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  const handleViewDetails = (cat) => {
    setSelectedCategories(cat);
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Category List</h4>
                <Link to="/addCategory" className="btn btn-primary btn-sm">
                  Add Category
                </Link>
              </div>
              <div>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">
                        <i className="ri-home-4-fill me-1" /> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      Category Listings
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body">
                  {/* Search Bar */}
                  <div className="mb-3" style={{ maxWidth: "300px" }}>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Search by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: "300px" }}
                    />
                  </div>
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-centered">
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>Icon</th>
                            <th>English Title</th>
                            <th>French Title</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat, index) => (
                              <tr key={cat.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {cat.icon ? (
                                    <a
                                      href={`${BASE_URL}/${cat.icon}`}
                                      data-fancybox="Cat-gallery"
                                      data-caption={cat.name || "Cat Image"}
                                    >
                                      <img
                                        src={`${BASE_URL}/${cat.icon}`}
                                        alt="Cat"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </a>
                                  ) : (
                                    "No Image"
                                  )}
                                </td>
                                <td>{cat.english_title}</td>
                                <td>{cat.french_title}</td>
                                <td>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`toggleStatus${cat.id}`}
                                      checked={cat.status === "active"}
                                      onChange={() =>
                                        toggleStatus(cat.id, cat.status)
                                      }
                                      style={{
                                        backgroundColor:
                                          cat.status === "active"
                                            ? "#2dbb58"
                                            : "#e9ecef",
                                        borderColor:
                                          cat.status === "active"
                                            ? "#2dbb58"
                                            : "#e9ecef",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="text-end">
                                  {/* <button
                                    className="btn btn-soft-primary btn-sm me-1"
                                    onClick={() =>
                                      navigate(`/viewCategory/${cat.id}`)
                                    }
                                  >
                                    <i className="ri-eye-fill"></i>{" "}
                                  </button> */}
                                  <button
                                    type="button"
                                    className="btn btn-soft-primary px-2 btn-sm me-1"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#view-details"
                                    aria-controls="offcanvasRight"
                                    onClick={() => handleViewDetails(cat)}
                                  >
                                    <i className="ri-eye-fill font-size-16"></i>
                                  </button>
                                  <button
                                    className="btn btn-warning btn-sm me-1"
                                    onClick={() =>
                                      navigate(`/editCategory/${cat.id}`)
                                    }
                                  >
                                    <i className="ri-edit-line text-white"></i>
                                  </button>
                                  <button
                                    className="btn btn-soft-danger btn-sm"
                                    onClick={() => deleteCategory(cat.id)}
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center text-muted"
                              >
                                No Categories found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Details Offcanvas - Keep this section exactly as it was */}
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
                Category Details
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
          {selectedCategories ? (
            <>
              <div className="scroll-room mb-3" id="scrollRoom">
                {selectedCategories.icon ? (
                  <a
                    href={`${BASE_URL}/${selectedCategories.icon}`}
                    data-fancybox="gallery"
                    className="image-popup-gallery-item"
                  >
                    <img
                      src={`${BASE_URL}/${selectedCategories.icon}`}
                      className="img-fluid rounded"
                      alt="User"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">No Image Available</span>
                  </div>
                )}
              </div>
              <div>
                <div className="border-bottom mb-2 pb-1">
                  {/* <h5 className="fw-semibold font-size-17 mb-1">
                    {selectedCategories.icon || "No Name"}
                  </h5> */}
                </div>
                <div className="d-flex align-items-center border-bottom pt-1 pb-3">
                  {selectedCategories.icon ? (
                    <img
                      src={`${BASE_URL}/${selectedCategories.icon}`}
                      className="rounded-circle me-3"
                      width="100"
                      height="100"
                      alt="User Avatar"
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <i className="ri-user-line font-size-20 text-muted"></i>
                    </div>
                  )}
                </div>
              </div>
              <div className="font-size-16 fw-medium pt-3 mt-1 mb-2">
                Category Information
              </div>
              <table
                className="table table-borderless"
                style={{ marginLeft: "-8px" }}
              >
                <tbody>
                  <tr>
                    <td>English Title:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedCategories.english_title || ""}
                    </td>
                  </tr>

                  <tr>
                    <td>French Title:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedCategories?.french_title || ""}
                    </td>
                  </tr>

                  <tr>
                    <td>Status :</td>
                    <td className="text-end text-black fw-medium">
                      <span
                        className={`badge ${
                          selectedCategories.status === "active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {selectedCategories.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No Category selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
