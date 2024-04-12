import React, { useState, useEffect } from "react";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
      // Check if the response message is "No data found"
      if (data.message === "No data found") {
        toast.info("No data found");
      } else {
        // Show toast message with the response message
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to fetch vendor data");
    }
  };

  const fetchVendors = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/vendor/get`, // Fixed URL path
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.error(response.data.message);
      } else {
        setVendors(response.data.data);
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

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]+$/; // Only alphabets and spaces allowed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format validation

    // Mobile number validation: Allow only numbers and ensure it has exactly 10 digits
    if (name === "mobileNo") {
      if (!/^\d{10}$/.test(value)) {
        // Set the error message if the mobile number input doesn't meet the criteria
        setMobileError(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
      } else {
        // Clear the error message if the input is valid
        setMobileError("");
      }
    }

    // Validation for Staff Name
    if (name === "name") {
      if (!nameRegex.test(value)) {
        toast.error("Staff Name should only contain alphabets and spaces");
        return; // Prevent further processing if validation fails
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
      // Mobile number validation: Allow only numbers and ensure it has exactly 10 digits
      if (!/^\d{10}$/.test(formData.mobileNo)) {
        toast.error(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
        return;
      }
  
      // Validation for other fields
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
  
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if email is in proper format
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }
  
      // Other validation rules...
  
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
      if (!data.success) {
        if (data.message === "Mobile number is already in use") {
          toast.error(data.message);
        } else {
          toast.error(data.message);
        }
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
  
  const handleEditVendor = async () => {
    setLoading(true);
    try {
      // Mobile number validation: Allow only numbers and ensure it has exactly 10 digits
      if (!/^\d{10}$/.test(formData.mobileNo)) {
        toast.error(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
        return;
      }
  
      // Validation for other fields
      if (!formData.name || !formData.mobileNo || !formData.email) {
        toast.error("Name, Mobile Number, and Email are required fields");
        return;
      }
  
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if email is in proper format
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }
  
      // Other validation rules...
  
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/updateDetails/${editingVendorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!data.success) {
        if (data.message === "Mobile number is already in use") {
          toast.error(data.message);
        } else {
          toast.error("Failed to update vendor");
        }
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
      if (data.success) {
        toast.error("Failed to delete vendor");
      } else {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    }
  };
  
  

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
    setFormData({
      name: "",
      mobileNo: "",
      email: "",
      password: "",
      address: "",
    });
  };

  const handleConfirmDelete = () => {
    handleDeleteVendor(selectedVendorId);
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ width: "100%", p: 2, marginTop: "5%" }}>
        <Button
          sx={{ background: "orange" }}
          variant="contained"
          onClick={handleOpenCreateDialog}
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
                        onClick={() => handleDeleteVendor(vendor._id)}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vendor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
      <DialogTitle>Vendor Details</DialogTitle>
      <DialogContent>
        {selectedVendorDetails ? (
          <div>
            <Typography>Name: {selectedVendorDetails.name}</Typography>
            <Typography>Mobile: {selectedVendorDetails.mobileNo}</Typography>
            <Typography>Email: {selectedVendorDetails.email}</Typography>
            <Typography>Address: {selectedVendorDetails.address}</Typography>
            {/* Display other vendor details as needed */}
          </div>
        ) : (
          <Typography>No vendor details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default VendorManagement;
