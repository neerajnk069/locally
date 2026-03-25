import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../../Config";

const ViewCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`/category/${id}`);
      if (res.data.success) setCategory(res.data.body);
    } catch (err) {
      console.log("Fetch category error", err);
    }
  };

  if (!category) return <div>Loading...</div>;

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">View Category</h4>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="mb-2">
                    {category.icon && (
                      <div className="mb-2">
                        <strong>Icon:</strong>
                        <img
                          src={`${BASE_URL}/${category.icon}`}
                          alt="icon"
                          style={{ width: "50px", marginLeft: "10px" }}
                        />
                      </div>
                    )}
                    <strong>English Title:</strong> {category.english_title}
                  </div>
                  <div className="mb-2">
                    <strong>French Title:</strong> {category.french_title}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {category.status}
                  </div>

                  <Link to="/categorylist" className="btn btn-secondary">
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCategory;
