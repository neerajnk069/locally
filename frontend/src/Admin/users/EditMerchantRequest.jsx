import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const EditMerchantRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country_code, setCountry_code] = useState("");
  const [phone, setPhone] = useState("");
  const [profile_image, setProfile_image] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [message, setMessage] = useState("active");

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    if (id) {
      fetchMerchantRequest();
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

  const fetchMerchantRequest = async () => {
    try {
      const res = await axiosInstance.get(`/viewDetail/${id}`);
      if (res.data.success) {
        const merchant = res.data.body;
        setName(merchant.name || "");
        setEmail(merchant.email || "");
        setPhone(merchant.phone || "");
        setCountry_code(merchant.country_code || "");
        setMessage(merchant.message || "");

        console.log("Image URL:", `${BASE_URL}/${merchant.profile_image}`);

        if (merchant.profile_image) {
          setPreviewImage(`${BASE_URL}/${merchant.profile_image}`);
        }
      }
    } catch (err) {
      console.log("Fetch merchant request error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("country_code", country_code);
      formData.append("phone", phone);
      formData.append("message", message);
      formData.append("password", password);

      if (profile_image) formData.append("profile_image", profile_image);

      const res = await axiosInstance.put(
        `/editMerchantRequest/${id}`,
        formData,
      );
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/merchantreqlist");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to update Merchant Request.", "error");
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Edit Merchant Request</h4>
              </div>

              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProfile_image(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {previewImage && (
                        <div className="mt-3">
                          <label>Current Image:</label>
                          <br />
                          <img
                            src={previewImage}
                            alt="Merchant Image"
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
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Password</label>

                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        {/* Eye Button */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? "🙈" : "👁"}
                        </button>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={generatePassword}
                      >
                        Generate Random Password
                      </button>
                    </div>
                    <div className="mb-3">
                      <label>Country Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={country_code}
                        onChange={(e) => setCountry_code(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Phone Number</label>
                      <input
                        type="number"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Message</label>
                      <input
                        type="text"
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>

                    <button className="btn btn-primary">Submit</button>
                    <Link
                      to="/merchantreqlist"
                      className="btn btn-secondary ms-2"
                    >
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

export default EditMerchantRequest;
