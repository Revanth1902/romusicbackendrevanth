import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Staffmanagement.css";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import TableSortLabel from "@mui/material/TableSortLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import SideBar from "../../Component/SideBar";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [openAddStaffDialog, setOpenAddStaffDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const [newStaffData, setNewStaffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/staff",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      );
      if (response.data.success) {
        setStaffList(response.data.staff);
      } else {
        setStaffList([]);
        toast.error("Failed to fetch staff");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const response = await axios.delete(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/deletestaff/${staffToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      );
      if (response.data.success) {
        toast.success("Staff deleted successfully");
        fetchStaff(); // Refresh the staff list
      } else {
        toast.error("Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    } finally {
      setStaffToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleAddStaff = async () => {
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const response = await axios.post(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/newstaff",
        newStaffData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      );
      if (response.data.success) {
        toast.success("Staff added successfully");
        setOpenAddStaffDialog(false);
        fetchStaff(); // Refresh the staff list
      } else {
        toast.error("Failed to add staff");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setNewStaffData({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      mobileNo: staff.mobileNo,
    });
    setOpenEditDialog(true);
  };

  const handleConfirmDelete = (staff) => {
    setStaffToDelete(staff);
    setOpenDeleteDialog(true);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleInputChange = (e) => {
    setNewStaffData({ ...newStaffData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const response = await axios.put(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/editstaff/${selectedStaff._id}`,
        newStaffData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      );
      if (response.data.success) {
        toast.success("Staff updated successfully");
        setOpenEditDialog(false);
        fetchStaff(); // Refresh the staff list
      } else {
        toast.error("Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    }
  };

  const sortedStaff = staffList.sort((a, b) => {
    // Implement sorting logic here
  });

  return (
    <>
      <SideBar />
      <div className="staff-management">
        <h2>Staff List</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddStaffDialog(true)}
        >
          Add Staff
        </Button>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : staffList.length === 0 ? (
          <p>No staff at the moment</p>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "firstName"}
                      direction={orderBy === "firstName" ? order : "asc"}
                      onClick={() => handleRequestSort("firstName")}
                    >
                      First Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "lastName"}
                      direction={orderBy === "lastName" ? order : "asc"}
                      onClick={() => handleRequestSort("lastName")}
                    >
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={orderBy === "email" ? order : "asc"}
                      onClick={() => handleRequestSort("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "mobileNo"}
                      direction={orderBy === "mobileNo" ? order : "asc"}
                      onClick={() => handleRequestSort("mobileNo")}
                    >
                      Mobile No
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedStaff.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell>{staff.firstName}</TableCell>
                    <TableCell>{staff.lastName}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.mobileNo}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(staff)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleConfirmDelete(staff)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Staff</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this staff?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAddStaffDialog}
          onClose={() => setOpenAddStaffDialog(false)}
        >
          <DialogTitle>Add Staff</DialogTitle>
          <DialogContent>
            <TextField
              name="firstName"
              label="First Name"
              value={newStaffData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={newStaffData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={newStaffData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobileNo"
              label="Mobile No"
              value={newStaffData.mobileNo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddStaffDialog(false)}>Cancel</Button>
            <Button onClick={handleAddStaff} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogContent>
            <TextField
              name="firstName"
              label="First Name"
              value={newStaffData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={newStaffData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={newStaffData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobileNo"
              label="Mobile No"
              value={newStaffData.mobileNo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  );
};

export default StaffManagement;
