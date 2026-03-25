import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const EditConciergeRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country_code, setCountry_code] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [category_id, setCategory_id] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("active");

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  // useEffect(() => {
  //   if (id) {
  //     fetchConciergeRequest();
  //   }
  // }, [id]);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const value = e.target.value;
      if (value.endsWith("  ")) {
        e.preventDefault();
      }
    }
  };

  const fetchConciergeRequest = async () => {
    try {
      const res = await axiosInstance.get(`/viewConciergeDetail/${id}`);
      if (res.data.success) {
        const concierge = res.data.body;
        setName(concierge.name || "");
        setEmail(concierge.email || "");
        setPhone(concierge.phone || "");
        setCountry_code(concierge.country_code || "");
        // setCategory(concierge.category || "");
        setCategory_id(concierge.category_id || "");
        setAddress(concierge.address || "");
        setDescription(concierge.description || "");
      }
    } catch (err) {
      console.log("Fetch concierge request error", err);
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
      formData.append("password", password);
      // formData.append("category", category);
      formData.append("category_id", category_id);
      formData.append("address", address);
      formData.append("description", description);

      const res = await axiosInstance.put(
        `/editConciergeRequest/${id}`,
        formData,
      );
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/conciergereqlist");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to update Concierge Request.", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categoryList");

      if (res.data.success) {
        setCategories(res.data.body);
      }
      console.log(res.data);
    } catch (error) {
      console.log("Category fetch error", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConciergeRequest();
    }

    fetchCategories();
  }, [id]);

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Edit Concierge Request</h4>
              </div>

              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Business Name</label>
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
                      <label>Business Category</label>
                      {/* <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      /> */}
                      <select
                        className="form-control"
                        value={category_id}
                        onChange={(e) => setCategory_id(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.english_title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Business Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label> Brief Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                      />
                    </div>

                    <button className="btn btn-primary">Submit</button>
                    <Link
                      to="/conciergereqlist"
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

export default EditConciergeRequest;
