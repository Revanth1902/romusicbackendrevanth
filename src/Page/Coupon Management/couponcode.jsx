import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./couponcode.css";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCouponData, setNewCouponData] = useState({
    code: "",
    amount: "",
    description: "",
    limit: "",
  });
  const [editCouponData, setEditCouponData] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

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
      if (
        !Number.isInteger(parseInt(newCouponData.amount)) ||
        !Number.isInteger(parseInt(newCouponData.limit))
      ) {
        toast.error("Amount and Limit must be integers");
        return;
      }

      if (
        parseInt(newCouponData.amount) < 0 ||
        parseInt(newCouponData.limit) < 0
      ) {
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
          amount: "",
          description: "",
          limit: "",
        });
        fetchAllCoupons();
        toast.success("Coupon added successfully");
        setShowAddCouponModal(false);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error("Failed to add coupon");
    }
  };

  const handleUpdateCoupon = async () => {
    try {
      if (
        !Number.isInteger(parseInt(editCouponData.amount)) ||
        !Number.isInteger(parseInt(editCouponData.limit))
      ) {
        toast.error("Amount and Limit must be integers");
        return;
      }

      if (
        parseInt(editCouponData.amount) < 0 ||
        parseInt(editCouponData.limit) < 0
      ) {
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
          color="primary"
          onClick={() => setShowAddCouponModal(true)}
          style={{ margin: "20px" }}
        >
          Add Coupon
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("code")}>
                  <Typography variant="subtitle1">
                    Code {getSortIcon("code")}
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort("amount")}>
                  <Typography variant="subtitle1">
                    Amount {getSortIcon("amount")}
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort("description")}>
                  <Typography variant="subtitle1">
                    Description {getSortIcon("description")}
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort("limit")}>
                  <Typography variant="subtitle1">
                    Limit {getSortIcon("limit")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography>
                      No coupons available at this moment.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedCoupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.amount}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>{coupon.limit}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditCoupon(coupon)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirmation(coupon)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this coupon?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDeleteCoupon(couponToDelete._id)}
              color="secondary"
            >
              Delete
            </Button>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Coupon Dialog */}
        <Dialog
          open={showAddCouponModal}
          onClose={() => setShowAddCouponModal(false)}
        >
          <DialogTitle>Add Coupon</DialogTitle>
          <DialogContent>
            <TextField
              label="Coupon Code"
              value={newCouponData.code}
              onChange={(e) =>
                setNewCouponData({ ...newCouponData, code: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Amount"
              type="number"
              value={newCouponData.amount}
              onChange={(e) =>
                setNewCouponData({
                  ...newCouponData,
                  amount: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newCouponData.description}
              onChange={(e) =>
                setNewCouponData({
                  ...newCouponData,
                  description: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Limit"
              type="number"
              value={newCouponData.limit}
              onChange={(e) =>
                setNewCouponData({
                  ...newCouponData,
                  limit: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowAddCouponModal(false);
                setNewCouponData({
                  code: "",
                  amount: "",
                  description: "",
                  limit: "",
                });
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={handleAddCoupon} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Coupon Dialog */}
        {editCouponData && (
          <Dialog
            open={Boolean(editCouponData)}
            onClose={() => setEditCouponData(null)}
          >
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogContent>
              <TextField
                label="Coupon Code"
                value={editCouponData.code}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    code: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                type="number"
                value={editCouponData.amount}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    amount: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={editCouponData.description}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    description: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Limit"
                type="number"
                value={editCouponData.limit}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    limit: e.target.value < 0 ? 0 : Math.floor(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateCoupon} color="primary">
                Update
              </Button>
              <Button onClick={() => setEditCouponData(null)} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Coupons;
