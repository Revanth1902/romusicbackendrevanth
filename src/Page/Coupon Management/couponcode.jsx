import React, { useState, useEffect } from "react";
import axios from "axios";
import "./couponcode.css";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"; // Import icons for sorting
import { Button } from "@mui/material";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCouponData, setNewCouponData] = useState({
    code: "",
    amount: 0,
    description: "",
    limit: 0,
  });
  const [editCouponData, setEditCouponData] = useState(null);
  const [order, setOrder] = useState("asc"); // State for sorting order
  const [orderBy, setOrderBy] = useState("code"); // State for sorting column
  const [showAddCouponModal, setShowAddCouponModal] = useState(false); // State for showing add coupon modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation dialog
  const [couponToDelete, setCouponToDelete] = useState(null); // State to store the coupon being deleted

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const fetchAllCoupons = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCoupons(response.data.allCouponList);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleDeleteConfirmation = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/coupon/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        fetchAllCoupons();
        toast.success("Coupon deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      // Reset editCouponData and hide the delete confirmation dialog
      setEditCouponData(null);
      setShowDeleteConfirmation(false);
      fetchAllCoupons();
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditCouponData(coupon);
  };

  const handleAddCoupon = async () => {
    try {
      if (!Number.isInteger(newCouponData.amount) || !Number.isInteger(newCouponData.limit)) {
        toast.error("Amount and Limit must be integers");
        return;
      }
  
      if (newCouponData.amount < 0 || newCouponData.limit < 0) {
        toast.error("Amount and Limit cannot be negative");
        return;
      }
  
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/coupon/new`,
        newCouponData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setNewCouponData({
          code: "",
          amount: 0,
          description: "",
          limit: 0,
        });
        fetchAllCoupons();
        toast.success("Coupon added successfully");
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error("Failed to add coupon");
    }
  };
  
  const handleUpdateCoupon = async () => {
    try {
      if (!Number.isInteger(editCouponData.amount) || !Number.isInteger(editCouponData.limit)) {
        toast.error("Amount and Limit must be integers");
        return;
      }
  
      if (editCouponData.amount < 0 || editCouponData.limit < 0) {
        toast.error("Amount and Limit cannot be negative");
        return;
      }
  
      const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/updatecoupon/${editCouponData._id}`,
        editCouponData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        fetchAllCoupons();
        setEditCouponData(null);
        toast.success("Coupon updated successfully");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon");
    }
  };
  

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCoupons = coupons.slice().sort((a, b) => {
    const isAsc = order === "asc";
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (property) => {
    if (orderBy === property) {
      return order === "asc" ? <ArrowUpward /> : <ArrowDownward />;
    }
    return null;
  };

  return (
    <>
      <SideBar />
      <div className="coupons-container">
        <Button
          variant="contained"
          onClick={() => setShowAddCouponModal(true)}
          style={{ backgroundColor: "#ffa500", marginRight: "5%" }}
        >
          Add Coupon
        </Button>
        <div className="coupons-list-header">
          <div className="coupon-field" onClick={() => handleSort("code")}>
            Code {getSortIcon("code")}
          </div>
          <div className="coupon-field" onClick={() => handleSort("amount")}>
            Amount {getSortIcon("amount")}
          </div>
          <div
            className="coupon-field"
            onClick={() => handleSort("description")}
          >
            Description {getSortIcon("description")}
          </div>
          <div className="coupon-field" onClick={() => handleSort("limit")}>
            Limit {getSortIcon("limit")}
          </div>
          <div className="coupon-field">Actions</div>
        </div>

        <div className="coupons-list-container">
          <div className="coupons-list">
            {coupons.length === 0 ? (
              <p>No coupons available at this moment.</p>
            ) : (
              sortedCoupons.map((coupon) => (
                <div key={coupon._id} className="coupon-item">
                  <div className="coupon-field">{coupon.code}</div>
                  <div className="coupon-field">{coupon.amount}</div>
                  <div className="coupon-field">{coupon.description}</div>
                  <div className="coupon-field">{coupon.limit}</div>
                  <div className="coupon-field">
                    <EditIcon
                      className="edit-icon"
                      onClick={() => handleEditCoupon(coupon)}
                    />
                    <DeleteIcon
                      className="delete-icon"
                      onClick={() => handleDeleteConfirmation(coupon)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <ToastContainer />

        {showDeleteConfirmation && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this coupon?</p>
              <div className="delete-confirmation-buttons">
                <button onClick={() => handleDeleteCoupon(couponToDelete._id)}>
                  Delete
                </button>

                <button onClick={() => setShowDeleteConfirmation(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Coupon Modal */}
        {showAddCouponModal && (
          <div className="add-coupon-modal">
            <div className="modal-content">
              <h2>Add Coupon</h2>
              <input
                type="text"
                placeholder="Coupon Code"
                value={newCouponData.code}
                onChange={(e) =>
                  setNewCouponData({ ...newCouponData, code: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={newCouponData.amount}
                onChange={(e) =>
                  setNewCouponData({
                    ...newCouponData,
                    amount: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                min="0"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCouponData.description}
                onChange={(e) =>
                  setNewCouponData({
                    ...newCouponData,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Limit"
                value={newCouponData.limit}
                onChange={(e) =>
                  setNewCouponData({
                    ...newCouponData,
                    limit: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                min="0"
              />
              <button onClick={() => setShowAddCouponModal(false)}>
                Cancel
              </button>
              <button onClick={handleAddCoupon}>Submit</button>
            </div>
          </div>
        )}

        {/* Edit Coupon Modal */}
        {editCouponData && (
          <div className="edit-coupon-modal">
            <div className="modal-content">
              <h2>Edit Coupon</h2>
              <input
                type="text"
                placeholder="Coupon Code"
                value={editCouponData.code}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    code: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={editCouponData.amount}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    amount: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                min="0"
              />
              <input
                type="text"
                placeholder="Description"
                value={editCouponData.description}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Limit"
                value={editCouponData.limit}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    limit: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                min="0"
              />
              <button onClick={handleUpdateCoupon}>Update</button>
              <button onClick={() => setEditCouponData(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Coupons;
