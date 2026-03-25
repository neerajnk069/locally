// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import { axiosInstance, BASE_URL } from "../../Config";

// const MerchantsList = () => {
//   const navigate = useNavigate();
//   const [merchants, setMerchants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedMerchant, setSelectedMerchant] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("all");

//   const limit = 10;
//   const dateFilters = [
//     { value: "all", label: "All Data" },
//     { value: "7", label: "Last 7 Days" },
//     { value: "30", label: "This Month" },
//     { value: "180", label: "Last 6 Months" },
//     { value: "365", label: "Last Year" },
//   ];

//   const fetchMerchants = async (page = 1, search = "") => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(
//         `/merchantlist?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
//       );
//       if (res.data.success) {
//         setMerchants(res.data.body.data);
//         setTotalPages(res.data.body.totalPages);
//       }
//     } catch {
//       toast.error("Failed to fetch merchants");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMerchants(currentPage, searchTerm);
//   }, [currentPage, searchTerm]);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const handleDateFilter = (value) => {
//     setDateFilter(value);
//     setCurrentPage(1);
//   };

//   const deleteMerchant = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.post(`/merchantdelete/${id}`);
//         toast.success("Merchant deleted successfully");
//         fetchMerchants(currentPage, searchTerm);
//       } catch {
//         toast.error("Failed to delete merchant");
//       }
//     }
//   };

//   const toggleStatus = async (merchant) => {
//     try {
//       const newStatus = merchant.status === "1" ? "0" : "1";
//       await axiosInstance.post("/merchantstatus", {
//         id: merchant.id,
//         status: newStatus,
//       });
//       setMerchants(
//         merchants.map((m) =>
//           m.id === merchant.id ? { ...m, status: newStatus } : m,
//         ),
//       );
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleViewDetails = (m) => {
//     setSelectedMerchant(m);
//   };

//   const getCurrentFilterLabel = () => {
//     const filter = dateFilters.find((f) => f.value === dateFilter);
//     return filter ? filter.label : "All Data";
//   };

//   return (
//     <>
//       <div id="layout-wrapper">
//         <div className="main-content">
//           <div className="page-content">
//             <div className="container-fluid">
//               <div className="title-box mb-3 pb-1">
//                 <h4 className="mb-0 page-title">Merchant List</h4>
//                 <Link to="/merchant/add" className="btn btn-primary btn-sm">
//                   <i className="ri-add-line me-1"></i> Add Merchant
//                 </Link>
//                 <nav aria-label="breadcrumb" className="mt-1">
//                   <ol className="breadcrumb mb-0">
//                     <li className="breadcrumb-item">
//                       <Link to="/dashboard" className="new">
//                         <i className="ri-home-4-fill me-1 new" /> Home
//                       </Link>
//                     </li>
//                     <li className="breadcrumb-item">
//                       <Link to="/" className="new">
//                         <i className="ri-group-2-line me-1 new" /> Merchants
//                         Management
//                       </Link>
//                     </li>
//                     <li className="breadcrumb-item active" aria-current="page">
//                       Merchant Management Listings
//                     </li>
//                   </ol>
//                 </nav>
//               </div>
//               <div className="card">
//                 <div className="card-body cusbar">
//                   <div
//                     className="card-head justify-content-start adjusttwo mb-3"
//                     style={{ flexWrap: "nowrap" }}
//                   >
//                     <div className="tbl-search position-relative">
//                       <input
//                         type="text"
//                         placeholder="Search by name/email"
//                         value={searchTerm}
//                         onChange={(e) => {
//                           setSearchTerm(e.target.value);
//                           setCurrentPage(1);
//                         }}
//                       />
//                       <i className="ri-search-line" />
//                     </div>

//                     <div className="dropdown tbl-drop mb-3">
//                       <button
//                         className="btn btn-light dropdown-toggle"
//                         type="button"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         {getCurrentFilterLabel()}
//                       </button>
//                       <ul className="dropdown-menu">
//                         {dateFilters.map((filter) => (
//                           <li key={filter.value}>
//                             <button
//                               className="dropdown-item"
//                               type="button"
//                               onClick={() => handleDateFilter(filter.value)}
//                             >
//                               {filter.label}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>

//                   {loading ? (
//                     <div className="text-center py-5">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="table-responsive table-card border-top">
//                         <div data-simplebar="" className="cus-scroll scmob">
//                           <table className="table table-bordered">
//                             <thead>
//                               <tr>
//                                 <th>Sr.no</th>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Phone</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {merchants.length > 0 ? (
//                                 merchants.map((m, i) => (
//                                   <tr key={m.id}>
//                                     <td>{(currentPage - 1) * limit + i + 1}</td>
//                                     <td>
//                                       {m.user?.business_name || m.user?.name}
//                                     </td>
//                                     <td>{m.user?.email}</td>
//                                     <td>{m.user?.phone}</td>
//                                     <td>
//                                       <input
//                                         type="checkbox"
//                                         checked={m.status === "1"}
//                                         onChange={() => toggleStatus(m)}
//                                       />
//                                     </td>
//                                     <td>
//                                       <button
//                                         className="btn btn-info btn-sm me-2"
//                                         onClick={() => handleViewDetails(m)}
//                                       >
//                                         View
//                                       </button>
//                                       <button
//                                         className="btn btn-primary btn-sm me-2"
//                                         onClick={() =>
//                                           navigate(`/merchant/edit/${m.id}`)
//                                         }
//                                       >
//                                         Edit
//                                       </button>
//                                       <button
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => deleteMerchant(m.id)}
//                                       >
//                                         Delete
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan="6" className="text-center">
//                                     No merchants found
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                           <div className="d-flex justify-content-center align-items-center mt-3">
//                             <Stack
//                               spacing={2}
//                               className="d-flex justify-content-center mt-3"
//                             >
//                               <Pagination
//                                 count={totalPages}
//                                 page={currentPage}
//                                 onChange={handlePageChange}
//                                 color="error"
//                               />
//                             </Stack>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* User Details Offcanvas - Keep this section exactly as it was */}
//       <div
//         className="offcanvas offcanvas-end rdetails"
//         tabIndex="-1"
//         id="view-details"
//         aria-labelledby="offcanvasRightLabel"
//       >
//         <div className="offcanvas-header d-block">
//           <div className="d-flex align-items-center">
//             <div className="d-flex align-items-center">
//               <h5
//                 className="offcanvas-title mb-0 me-3 fw-semibold"
//                 id="offcanvasRightLabel"
//               >
//                 Merchant Details
//               </h5>
//             </div>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="offcanvas"
//               aria-label="Close"
//             ></button>
//           </div>
//         </div>
//         <div className="offcanvas-body">
//           {selectedMerchant ? (
//             <>
//               <div className="scroll-room mb-3" id="scrollRoom">
//                 {selectedMerchant.profile_logo ? (
//                   <a
//                     href={`${BASE_URL}/${selectedMerchant.profile_logo}`}
//                     data-fancybox="gallery"
//                     className="image-popup-gallery-item"
//                   >
//                     <img
//                       src={`${BASE_URL}/${selectedMerchant.profile_logo}`}
//                       className="img-fluid rounded"
//                       alt="User"
//                       style={{
//                         width: "100%",
//                         maxHeight: "300px",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </a>
//                 ) : (
//                   <div
//                     className="bg-light rounded d-flex align-items-center justify-content-center"
//                     style={{ height: "200px" }}
//                   >
//                     <span className="text-muted">No Image Available</span>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <div className="border-bottom mb-2 pb-1">
//                   <h5 className="fw-semibold font-size-17 mb-1">
//                     {selectedMerchant.name || "No Name"}
//                   </h5>
//                 </div>
//                 <div className="d-flex align-items-center border-bottom pt-1 pb-3">
//                   {selectedMerchant.profile_logo ? (
//                     <img
//                       src={`${BASE_URL}/${selectedMerchant.profile_logo}`}
//                       className="rounded-circle me-3"
//                       width="100"
//                       height="100"
//                       alt="User Avatar"
//                     />
//                   ) : (
//                     <div
//                       className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
//                       style={{ width: "100px", height: "100px" }}
//                     >
//                       <i className="ri-user-line font-size-20 text-muted"></i>
//                     </div>
//                   )}
//                   <div>
//                     <div className="d-flex align-items-center position-relative mb-1">
//                       <span className="me-2">Name</span>
//                       <span className="line-circle"></span>
//                       <span className="ms-2 font-size-15 fw-semibold">
//                         {selectedMerchant.name || "No Name"}
//                       </span>
//                     </div>
//                     <div className="d-flex align-items-center position-relative mb-1">
//                       <span className="me-2">
//                         Email: {selectedMerchant.email || "No Email"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="font-size-16 fw-medium pt-3 mt-1 mb-2">
//                 Merchant Information
//               </div>
//               <table
//                 className="table table-borderless"
//                 style={{ marginLeft: "-8px" }}
//               >
//                 <tbody>
//                   <tr>
//                     <td>Merchant ID :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant.id}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Name :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant.name || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Email :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant.email || ""}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td>Phone :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant?.country_code || ""}{" "}
//                       {selectedMerchant?.phone || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Description :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant?.description || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Website :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant?.website || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>WhatsApp :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant?.whatsApp_link || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Opening Hours :</td>
//                     <td className="text-end text-black fw-medium">
//                       {selectedMerchant?.opening_hours || ""}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td>Status :</td>
//                     <td className="text-end text-black fw-medium">
//                       <span
//                         className={`badge ${
//                           selectedMerchant.status === "1"
//                             ? "bg-success"
//                             : "bg-danger"
//                         }`}
//                       >
//                         {selectedMerchant.status === "1"
//                           ? "Active"
//                           : "Inactive"}
//                       </span>
//                     </td>
//                   </tr>
//                   <div className="modal-footer">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => setSelectedMerchant(null)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </tbody>
//               </table>
//             </>
//           ) : (
//             <div className="text-center py-5">
//               <i className="ri-user-line font-size-48 text-muted"></i>
//               <p className="mt-3 text-muted">No merchant selected</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MerchantsList;

// {
//   /* <div
//         className="offcanvas offcanvas-end rdetails"
//         tabIndex="-1"
//         id="view-details"
//         aria-labelledby="offcanvasRightLabel"
//       >
//         <div className="offcanvas-header d-block">
//           <div className="d-flex align-items-center">
//             <div className="d-flex align-items-center">
//               <h5
//                 className="offcanvas-title mb-0 me-3 fw-semibold"
//                 id="offcanvasRightLabel"
//               >
//                 Merchant Details
//               </h5>
//             </div>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="offcanvas"
//               aria-label="Close"
//             ></button>
//           </div>
//         </div>
//         <div className="offcanvas-body">
//           {selectedUser ? (
//             <div>
//               <div className="scroll-room mb-3" id="scrollRoom">
//         {selectedMerchant && (
//           <div className="modal show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Merchant Details</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setSelectedMerchant(null)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <p>
//                     <b>Name:</b> {selectedMerchant.user?.name}
//                   </p>
//                   <p>
//                     <b>Email:</b> {selectedMerchant.user?.email}
//                   </p>
//                   <p>
//                     <b>Phone:</b> {selectedMerchant.user?.phone}
//                   </p>
//                   <p>
//                     <b>Description:</b> {selectedMerchant.description}
//                   </p>
//                   <p>
//                     <b>Website:</b> {selectedMerchant.website}
//                   </p>
//                   <p>
//                     <b>WhatsApp:</b> {selectedMerchant.whatsapp_link}
//                   </p>
//                   <p>
//                     <b>Opening Hours:</b> {selectedMerchant.opening_hours}
//                   </p>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() => setSelectedMerchant(null)}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       </div>
//     </> */
// }

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { axiosInstance, BASE_URL } from "../../Config";

const MerchantsList = () => {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;

  // Fetch merchants from backend
  const fetchMerchants = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/allMerchants`);
      if (res.data.success) {
        let allMerchants = res.data.body;

        // Filter search locally (backend API doesn't have search)
        if (search) {
          allMerchants = allMerchants.filter(
            (m) =>
              (m.user?.name || m.user?.business_name || "")
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              (m.user?.email || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
          );
        }

        setTotalPages(Math.ceil(allMerchants.length / limit));
        const startIndex = (page - 1) * limit;
        const paginated = allMerchants.slice(startIndex, startIndex + limit);
        setMerchants(paginated);
      }
    } catch (err) {
      toast.error("Failed to fetch merchants");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMerchants(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Delete merchant
  const deleteMerchant = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deleteMerchant/${id}`);
        toast.success("Merchant deleted successfully");
        fetchMerchants(currentPage, searchTerm);
      } catch {
        toast.error("Failed to delete merchant");
      }
    }
  };

  // Toggle status
  const toggleStatus = async (merchant) => {
    try {
      const newStatus = merchant.status === "1" ? "0" : "1";
      await axiosInstance.put(`/updateMerchant/${merchant.id}`, {
        status: newStatus,
      });
      setMerchants(
        merchants.map((m) =>
          m.id === merchant.id ? { ...m, status: newStatus } : m,
        ),
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleViewDetails = (m) => {
    setSelectedMerchant(m);
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 page-title">Merchant List</h4>
                <Link to="/merchant/add" className="btn btn-primary btn-sm">
                  Add Merchant
                </Link>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <input
                      type="text"
                      placeholder="Search by name/email"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="form-control w-25"
                    />
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr.no</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {merchants.length > 0 ? (
                            merchants.map((m, i) => (
                              <tr key={m.id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{m.user?.business_name || m.user?.name}</td>
                                <td>{m.user?.email}</td>
                                <td>{m.user?.phone}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={m.status === "1"}
                                    onChange={() => toggleStatus(m)}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-info btn-sm me-2"
                                    onClick={() => handleViewDetails(m)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() =>
                                      navigate(`/merchant/edit/${m.id}`)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteMerchant(m.id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No merchants found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <Stack
                        spacing={2}
                        className="d-flex justify-content-center mt-3"
                      >
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Stack>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Merchant Details Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
        style={{ visibility: selectedMerchant ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Merchant Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSelectedMerchant(null)}
          ></button>
        </div>
        <div className="offcanvas-body">
          {selectedMerchant ? (
            <div>
              <p>
                <b>Name:</b>{" "}
                {selectedMerchant.user?.name ||
                  selectedMerchant.user?.business_name}
              </p>
              <p>
                <b>Email:</b> {selectedMerchant.user?.email}
              </p>
              <p>
                <b>Phone:</b> {selectedMerchant.user?.phone}
              </p>
              <p>
                <b>Description:</b> {selectedMerchant.description}
              </p>
              <p>
                <b>Website:</b> {selectedMerchant.website}
              </p>
              <p>
                <b>WhatsApp:</b> {selectedMerchant.whatsapp_link}
              </p>
              <p>
                <b>Opening Hours:</b> {selectedMerchant.opening_hours}
              </p>
              <p>
                <b>Status:</b>{" "}
                {selectedMerchant.status === "1" ? "Active" : "Inactive"}
              </p>
            </div>
          ) : (
            <p>No merchant selected</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MerchantsList;
