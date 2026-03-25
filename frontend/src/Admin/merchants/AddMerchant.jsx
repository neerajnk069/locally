import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../Config";

const MerchantAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_id: "",
    category_id: "",
    description: "",
    website: "",
    whatsapp_link: "",
    opening_hours: "",
  });
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      if (res.data.success) setCategories(res.data.body);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/merchantcreate", form);
      toast.success("Merchant added successfully");
      navigate("/merchants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add merchant");
    }
  };

  return (
    <div className="container-fluid">
      <h4>Add New Merchant</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>User ID</label>
          <input
            type="number"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>WhatsApp Link</label>
          <input
            type="text"
            name="whatsapp_link"
            value={form.whatsapp_link}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Opening Hours</label>
          <input
            type="text"
            name="opening_hours"
            value={form.opening_hours}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Add Merchant
        </button>
      </form>
    </div>
  );
};

export default MerchantAdd;
