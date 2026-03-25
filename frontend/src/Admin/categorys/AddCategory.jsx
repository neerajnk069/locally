import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../../Config";

const AddCategory = () => {
  const navigate = useNavigate();
  const [englishTitle, setEnglishTitle] = useState("");
  const [frenchTitle, setFrenchTitle] = useState("");
  const [icon, setIcon] = useState(null);
  const [status, setStatus] = useState("active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("english_title", englishTitle);
      formData.append("french_title", frenchTitle);
      formData.append("status", status);
      if (icon) formData.append("icon", icon);

      const res = await axiosInstance.post("/addCategory", formData);
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/categoryList");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to add category.", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const value = e.target.value;
      if (value.endsWith("  ")) {
        e.preventDefault();
      }
    }
  };

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box mb-3 pb-1">
              <h4 className="mb-0 page-title">Add Category</h4>
              <nav className="breadcrumb mt-1">
                <Link to="/dashboard">Home</Link> / Add Category
              </nav>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>English Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={englishTitle}
                      onChange={(e) => setEnglishTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>French Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={frenchTitle}
                      onChange={(e) => setFrenchTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Icon</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setIcon(e.target.files[0])}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button className="btn btn-primary">Add Category</button>
                  <Link to="/categorylist" className="btn btn-secondary ms-2">
                    Cancel
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
