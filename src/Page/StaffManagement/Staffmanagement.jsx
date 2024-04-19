import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addStaffData, setAddStaffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });

  const [editStaffData, setEditStaffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });
  const [newStaffData, setNewStaffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/get`
      );
      if (response.data.success) {
        setStaffList(response.data.data);
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
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/delete/${staffToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Staff deleted successfully");
        fetchStaff();
      } else {
        toast.error(data.message); // Display error message from response
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

    if (addStaffData.mobileNo.length !== 10) {
      toast.error("Mobile number should be 10 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }
    setSubmitting(true); 
    try {
      // Existing code...

      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addStaffData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Staff added successfully");
        setOpenAddStaffDialog(false);
        fetchStaff();
        setAddStaffData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNo: "",
        });
      } else {
        toast.error(data.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (editStaffData.mobileNo.length !== 10) {
      toast.error("Mobile number should be 10 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }
    setSubmitting(true); 
    try {
      // Existing code...

      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/updateDetails/${selectedStaff._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editStaffData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Staff updated successfully");
        setOpenEditDialog(false);
        fetchStaff();
      } else {
        toast.error(data.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    } finally {
      setSubmitting(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobileNo) => {
    const regex = /^\d{10}$/;
    return regex.test(mobileNo);
  };

  const handleInputChange = (e) => {
    setNewStaffData({ ...newStaffData, [e.target.name]: e.target.value });
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditStaffData({
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

  const sortedStaff = [...staffList].sort((a, b) => {
    const orderByValueA = a[orderBy] || "";
    const orderByValueB = b[orderBy] || "";
    if (orderBy === "mobileNo") {
      return (
        (order === "asc" ? 1 : -1) *
        (parseInt(orderByValueA) - parseInt(orderByValueB))
      );
    } else {
      return (
        (order === "asc" ? 1 : -1) * orderByValueA.localeCompare(orderByValueB)
      );
    }
  });

  const filteredStaff = sortedStaff.filter((staff) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      staff.firstName.toLowerCase().includes(searchTermLower) ||
      staff.lastName.toLowerCase().includes(searchTermLower) ||
      staff.email.toLowerCase().includes(searchTermLower) ||
      String(staff.mobileNo).toLowerCase().includes(searchTermLower)
    );
  });

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/get`
      );

      if (response.data.success) {
        const staffData = response.data.data.map(
          ({ firstName, lastName, email, mobileNo, referralCount }) => ({
            "First Name": firstName,
            "Last Name": lastName,
            Email: email,
            "Mobile No": mobileNo,
            "Referral Count": referralCount,
          })
        );

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(staffData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Data");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, "staff_data.xlsx");
      } else {
        toast.error("Failed to export staff data");
      }
    } catch (error) {
      console.error("Error exporting staff data:", error);
      toast.error("Failed to export staff data");
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <SideBar />
      <div className="staff-management">
        <Box
          display="flex"
          alignItems="center"
          marginTop="7%"
          justifyContent="space-between"
          marginLeft="20%"
        >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mr: 1 }} // Add margin-right to create space between the elements
          />
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              onClick={() => setOpenAddStaffDialog(true)}
              style={{ backgroundColor: "#ffa500", marginRight: "5%" }}
            >
              Add Staff
            </Button>

            <Button
              variant="contained"
              onClick={handleExportExcel}
              style={{ backgroundColor: "#ffa500", marginRight: "5%" }}
            >
              Export
            </Button>
          </Box>
        </Box>
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
          <Typography variant="body1">No staff at the moment</Typography>
        ) : (
          <TableContainer
            component={Paper}
            style={{
              width: "80%",
              marginLeft: "19%",
              marginTop: "2%",
              marginBottom: "2%",
            }}
          >
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
                {filteredStaff.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell>
                      {capitalizeFirstLetter(staff.firstName)}
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(staff.lastName)}
                    </TableCell>

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
            <Typography>Are you sure you want to delete this staff?</Typography>
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
              value={addStaffData.firstName}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                  setAddStaffData({
                    ...addStaffData,
                    firstName: newValue,
                  });
                }
              }}
              fullWidth
              margin="normal"
              error={!/^[A-Za-z\s]*$/.test(addStaffData.firstName)}
              helperText={
                !/^[A-Za-z\s]*$/.test(addStaffData.firstName) &&
                "First Name should only contain alphabets"
              }
            />

            <TextField
              name="lastName"
              label="Last Name"
              value={addStaffData.lastName}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                  setAddStaffData({
                    ...addStaffData,
                    lastName: newValue,
                  });
                }
              }}
              fullWidth
              margin="normal"
              error={!/^[A-Za-z\s]*$/.test(addStaffData.lastName)}
              helperText={
                !/^[A-Za-z\s]*$/.test(addStaffData.lastName) &&
                "Last Name should only contain alphabets"
              }
            />

            <TextField
              name="email"
              label="Email"
              value={addStaffData.email}
              onChange={(e) =>
                setAddStaffData({ ...addStaffData, email: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobileNo"
              label="Mobile No"
              value={addStaffData.mobileNo}
              onChange={(e) =>
                setAddStaffData({ ...addStaffData, mobileNo: e.target.value })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddStaffDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddStaff}
              color="primary"
              disabled={
                submitting ||
                !/^[A-Za-z\s]*$/.test(addStaffData.firstName) ||
                !/^[A-Za-z\s]*$/.test(addStaffData.lastName)
              }
            >
              {submitting ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogContent>
            {selectedStaff && (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={editStaffData.firstName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                      setEditStaffData({
                        ...editStaffData,
                        firstName: newValue,
                      });
                    }
                  }}
                  fullWidth
                  margin="normal"
                  error={!/^[A-Za-z\s]*$/.test(editStaffData.firstName)}
                  helperText={
                    !/^[A-Za-z\s]*$/.test(editStaffData.firstName) &&
                    "First Name should only contain alphabets"
                  }
                />

                <TextField
                  name="lastName"
                  label="Last Name"
                  value={editStaffData.lastName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                      setEditStaffData({
                        ...editStaffData,
                        lastName: newValue,
                      });
                    }
                  }}
                  fullWidth
                  margin="normal"
                  error={!/^[A-Za-z\s]*$/.test(editStaffData.lastName)}
                  helperText={
                    !/^[A-Za-z\s]*$/.test(editStaffData.lastName) &&
                    "Last Name should only contain alphabets"
                  }
                />

                <TextField
                  name="email"
                  label="Email"
                  value={editStaffData.email}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      email: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  error={!validateEmail(editStaffData.email)}
                  helperText={
                    !validateEmail(editStaffData.email) &&
                    "Invalid email format"
                  }
                />
                <TextField
                  name="mobileNo"
                  label="Mobile No"
                  value={editStaffData.mobileNo}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      mobileNo: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  error={!validateMobile(editStaffData.mobileNo)}
                  helperText={
                    !validateMobile(editStaffData.mobileNo) &&
                    "Invalid mobile number format"
                  }
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button
              onClick={handleEditSave}
              color="primary"
              disabled={
                submitting ||
                !/^[A-Za-z ]*$/.test(editStaffData.firstName) ||
                !/^[A-Za-z ]+$/.test(editStaffData.lastName)
              }
            >
              {submitting ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  );
};

export default StaffManagement;
