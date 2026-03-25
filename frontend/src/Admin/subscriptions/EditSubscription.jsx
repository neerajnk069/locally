import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../../Config";

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant_id, setMerchantId] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");

  useEffect(() => {
    if (id) {
      fetchSubscription();
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

  const fetchSubscription = async () => {
    try {
      const res = await axiosInstance.get(`/allSubscriptions`);
      if (res.data.success) {
        const subscription = res.data.body.find(
          (item) => item.id === Number(id),
        );
        if (subscription) {
          setMerchantId(subscription.user_id || "");
          setStart_date(subscription.start_date || "");
          setEnd_date(subscription.end_date || "");
        }
      }
      console.log("API DATA:", res.data.body);
      console.log("ID PARAM:", id);
    } catch (err) {
      console.log("Fetch Subscription error", err);
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
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", merchant_id);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);

      const res = await axiosInstance.put(
        `/updateSubscription/${id}`,
        formData,
      );
      if (res.data.success) {
        Swal.fire("Success!", res.data.message, "success");
        navigate("/subscriptionList");
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
                <h4 className="mb-0 page-title">Edit Subscription</h4>
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

                    <button className="btn btn-primary">
                      Update Subscription
                    </button>
                    <Link
                      to="/subscriptionlist"
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

export default EditSubscription;
