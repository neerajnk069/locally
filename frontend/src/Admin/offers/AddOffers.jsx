import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../../Config";

const AddOffers = () => {
  const navigate = useNavigate();
  const [merchant_id, setMerchantId] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount_details, setDiscount_details] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", merchant_id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("discount_details", discount_details);
      formData.append("terms_conditions", terms_conditions);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);

      const res = await axiosInstance.post("/addOffer", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/offersList");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to add subscription.", "error");
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const res = await axiosInstance.get("/merchantlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setMerchants(res.data.body.data);
        // console.log(res.data);
      }
    } catch (error) {
      console.log(error);
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
              <h4 className="mb-0 page-title">Add Offers</h4>
              <nav className="breadcrumb mt-1">
                <Link to="/dashboard">Home</Link> / Add Offers
              </nav>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Merchant Name</label>
                    <select
                      className="form-control"
                      value={merchant_id}
                      onChange={(e) => setMerchantId(e.target.value)}
                      required
                    >
                      <option value="">Select Merchant</option>

                      {merchants.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Discount Details</label>
                    <input
                      type="text"
                      className="form-control"
                      value={discount_details}
                      onChange={(e) => setDiscount_details(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Terms Conditions</label>
                    <input
                      type="text"
                      className="form-control"
                      value={terms_conditions}
                      onChange={(e) => setTerms_conditions(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={start_date}
                      onChange={(e) => setStart_date(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={end_date}
                      onChange={(e) => setEnd_date(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>

                  <button className="btn btn-primary">Add Offers</button>
                  <Link to="/offerslist" className="btn btn-secondary ms-2">
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

export default AddOffers;
