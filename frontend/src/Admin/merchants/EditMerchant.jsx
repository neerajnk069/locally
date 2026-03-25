import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../Config";

const MerchantEdit = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchCategories();
    fetchMerchant();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      if (res.data.success) setCategories(res.data.body);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchMerchant = async () => {
    try {
      const res = await axiosInstance.get(`/merchant/${id}`);
      if (res.data.success) setForm(res.data.body);
    } catch {
      toast.error("Failed to load merchant data");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/merchantupdate/${id}`, form);
      toast.success("Merchant updated successfully");
      navigate("/merchants");
    } catch {
      toast.error("Failed to update merchant");
    }
  };

  return (
    <div className="container-fluid">
      <h4>Edit Merchant</h4>
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
          Update Merchant
        </button>
      </form>
    </div>
  );
};

export default MerchantEdit;
