import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  DialogContentText,
} from "@mui/material";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../Component/SideBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const VendorManagement = () => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
    address: "",
  });
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [viewingVendorData, setViewingVendorData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/vendor/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        setVendors(data.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "mobileNo") {
      if (!/^\d{10}$/.test(value)) {
        setMobileError(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
      } else {
        setMobileError("");
      }
    }

    if (name === "name") {
      if (!nameRegex.test(value)) {
        toast.error("Staff Name should only contain alphabets and spaces");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleOpenEditDialog = (vendorId) => {
    setEditingVendorId(vendorId);
    const vendorToEdit = vendors.find((vendor) => vendor._id === vendorId);
    setFormData({
      name: vendorToEdit.name,
      mobileNo: vendorToEdit.mobileNo,
      email: vendorToEdit.email,
      password: "",
      address: vendorToEdit.address,
    });
    setOpenEditDialog(true);
  };

  const handleCreateVendor = async () => {
    setLoading(true);
    try {
      if (!/^\d{10}$/.test(formData.mobileNo)) {
        toast.error(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
        return;
      }

      if (
        !formData.name ||
        !formData.mobileNo ||
        !formData.email ||
        !formData.password
      ) {
        toast.error(
          "Name, Mobile Number, Password, and Email are required fields"
        );
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }

      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/Vendor/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor created successfully");
        setOpenCreateDialog(false);
        fetchVendors();
        setFormData({
          name: "",
          mobileNo: "",
          email: "",
          password: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVendor = async (vendorId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/product/getProductByVendorId/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSelectedVendor(vendors.find((vendor) => vendor._id === vendorId)); // Set selectedVendor
        setViewingVendorData(data.data || []); // Set the vendor's product details, handling empty data
        setOpenViewDialog(true); // Open the dialog
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to fetch vendor data");
    }
  };

  const handleEditVendor = async () => {
    setLoading(true);
    try {
      if (!/^\d{10}$/.test(formData.mobileNo)) {
        toast.error("Mobile Number should be numeric and have exactly 10 digits");
        return;
      }
  
      if (!formData.name || !formData.mobileNo || !formData.email) {
        toast.error("Name, Mobile Number, and Email are required fields");
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }
  
      const token = Cookies.get("token");
      const vendorToEdit = vendors.find((vendor) => vendor._id === editingVendorId);
  
      // Compare form data with existing data to detect changes
      const updatedData = {};
      if (formData.name !== vendorToEdit.name) {
        updatedData.name = formData.name;
      }
      if (formData.mobileNo !== vendorToEdit.mobileNo) {
        updatedData.mobileNo = formData.mobileNo;
      }
      if (formData.email !== vendorToEdit.email) {
        updatedData.email = formData.email;
      }
      if (formData.address !== vendorToEdit.address) {
        updatedData.address = formData.address;
      }
  
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes detected");
        return;
      }
  
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/updateDetails/${editingVendorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData), // Send only the updated fields
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor updated successfully");
        setOpenEditDialog(false);
        fetchVendors();
        setFormData({
          name: "",
          mobileNo: "",
          email: "",
          password: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("Failed to update vendor");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteVendor = async (vendorId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/delete/${vendorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteVendor(selectedVendorId);
    setDeleteDialogOpen(false);
  };

  const navigate = useNavigate();

  const handleEditProduct = (productId) => {
    navigate(`/editproduct/${productId}`);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ width: "100%", p: 2, marginTop: "5%" }}>
        <Button
          sx={{ background: "orange" }}
          variant="contained"
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Vendor
        </Button>
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : vendors.length > 0 ? (
          <TableContainer component={Paper} style={{ marginTop: "3%" }}>
            <Table aria-label="vendors table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.mobileNo}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewVendor(vendor._id)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedVendorId(vendor._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenEditDialog(vendor._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No vendors available</Typography>
        )}
      </Box>
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create Vendor</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="mobileNo"
            label="Mobile Number"
            value={formData.mobileNo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateVendor}
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Vendor</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="mobileNo"
            label="Mobile Number"
            value={formData.mobileNo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>
            <CancelIcon /> Cancel
          </Button>
          <Button onClick={handleEditVendor} color="primary" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <>
                <CheckCircleIcon /> Update
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {deleteDialogOpen && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this coupon?</p>
              <div className="delete-confirmation-buttons">
                <button onClick={handleConfirmDelete} >
                  Delete
                </button>

                <button onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>Vendor Details</DialogTitle>
        <DialogContent>
          {selectedVendor && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Name:{" "}
                {selectedVendor.name.charAt(0).toUpperCase() +
                  selectedVendor.name.slice(1)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Mobile: {selectedVendor.mobileNo}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Email: {selectedVendor.email}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Address: {selectedVendor.address}
              </Typography>

              {/* Check if viewingVendorData exists and has length */}
              {viewingVendorData && viewingVendorData.length > 0 ? (
                <div>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Products:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>MRP</TableCell>
                          <TableCell>Is Verified</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewingVendorData.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product.name.charAt(0).toUpperCase() +
                                product.name.slice(1)}
                            </TableCell>

                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>₹{product.mrp}</TableCell>
                            <TableCell>
                              {product.isVerified === "true" ? (
                                <CheckCircleIcon style={{ color: "green" }} />
                              ) : (
                                <CancelIcon style={{ color: "red" }} />
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleEditProduct(product._id)}
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : (
                <Typography variant="subtitle1" align="center">
                  No products added by this vendor
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>
            <CloseIcon />
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default VendorManagement;
