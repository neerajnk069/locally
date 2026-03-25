import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../../Config";

const AddSubscription = () => {
  const navigate = useNavigate();
  const [merchant_id, setMerchantId] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  //   const [status, setStatus] = useState("active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", merchant_id);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);
      //   formData.append("status", status);

      const res = await axiosInstance.post("/addSubscription", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/subscriptionList");
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
              <h4 className="mb-0 page-title">Add Subscription</h4>
              <nav className="breadcrumb mt-1">
                <Link to="/dashboard">Home</Link> / Add Subscription
              </nav>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Merchant</label>
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
                  {/* <div className="mb-3">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div> */}
                  <button className="btn btn-primary">Add Subscription</button>
                  <Link
                    to="/subscriptionlist"
                    className="btn btn-secondary ms-2"
                  >
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

export default AddSubscription;
