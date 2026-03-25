import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [englishTitle, setEnglishTitle] = useState("");
  const [frenchTitle, setFrenchTitle] = useState("");
  const [icon, setIcon] = useState(null);
  const [previewIcon, setPreviewIcon] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const value = e.target.value;
      if (value.endsWith("  ")) {
        e.preventDefault();
      }
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`/category/${id}`);
      if (res.data.success) {
        const cat = res.data.body;
        setEnglishTitle(cat.english_title || "");
        setFrenchTitle(cat.french_title || "");
        setStatus(cat.status || "active");
        console.log("Image URL:", `${BASE_URL}/${cat.icon}`);

        if (cat.icon) {
          setPreviewIcon(`${BASE_URL}/${cat.icon}`);
        }
      }
    } catch (err) {
      console.log("Fetch category error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("english_title", englishTitle);
      formData.append("french_title", frenchTitle);
      formData.append("status", status);
      if (icon) formData.append("icon", icon);

      const res = await axiosInstance.put(`/updateCategory/${id}`, formData);
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/categoryList");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to update category.", "error");
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Edit Category</h4>
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
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIcon(file);
                            setPreviewIcon(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {previewIcon && (
                        <div className="mt-3">
                          <label>Current Icon:</label>
                          <br />
                          <img
                            src={previewIcon}
                            alt="Category Icon"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid #ddd",
                              marginTop: "5px",
                            }}
                          />
                        </div>
                      )}
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
                    <button className="btn btn-primary">Update Category</button>
                    <Link to="/categorylist" className="btn btn-secondary ms-2">
                      Back
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
