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
      const token = Cookies.get("token"); // Retrieve token from cookies
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/delete/${staffToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header
          },
        }
      );
      if (response.data.success) {
        toast.success("Staff deleted successfully");
        fetchStaff();
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
        if (submitting) return; // Prevent multiple clicks

        // Validation
        if (
            !addStaffData.firstName ||
            !addStaffData.lastName ||
            !addStaffData.email ||
            !addStaffData.mobileNo
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        // Validate names format
        const nameRegex = /^[a-zA-Z\s]+$/; // Updated regex pattern
        if (!nameRegex.test(addStaffData.firstName) || !nameRegex.test(addStaffData.lastName)) {
            toast.error("Invalid name format. Names should contain only letters and spaces.");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(addStaffData.email)) {
            toast.error("Invalid email format");
            return;
        }

        // Validate mobile number format
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(addStaffData.mobileNo)) {
            toast.error("Invalid mobile number format");
            return;
        }

        setSubmitting(true); // Start submission

        const token = Cookies.get("token"); // Retrieve token from cookies
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/admin/staff/new`,
            addStaffData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add authorization header
                },
            }
        );
        if (response.data.success) {
            toast.success("Staff added successfully");
            setOpenAddStaffDialog(false);
            fetchStaff();

            // Reset the form data
            setAddStaffData({
                firstName: "",
                lastName: "",
                email: "",
                mobileNo: "",
            });
        } else {
            toast.error("Failed to add staff");
        }
    } catch (error) {
        console.error("Error adding staff:", error);
        toast.error("Failed to add staff");
    } finally {
        setSubmitting(false); // End submission
    }
};


const handleEditSave = async () => {
    try {
        // Validation
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(editStaffData.firstName) || !nameRegex.test(editStaffData.lastName)) {
            toast.error("Invalid name format. Names should contain only letters.");
            return;
        }
        if (!validateEmail(editStaffData.email)) {
            toast.error("Invalid email format");
            return;
        }
        if (!validateMobile(editStaffData.mobileNo)) {
            toast.error("Invalid mobile number format");
            return;
        }

        setSubmitting(true);

        const token = Cookies.get("token");
        const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/admin/staff/updateDetails/${selectedStaff._id}`,
            editStaffData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.data.success) {
            toast.success("Staff updated successfully");
            setOpenEditDialog(false);
            fetchStaff();
        } else {
            toast.error("Failed to update staff");
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
              onChange={(e) =>
                setAddStaffData({ ...addStaffData, firstName: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={addStaffData.lastName}
              onChange={(e) =>
                setAddStaffData({ ...addStaffData, lastName: e.target.value })
              }
              fullWidth
              margin="normal"
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
              disabled={submitting} // Disable the button while submitting
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
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      firstName: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={editStaffData.lastName}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      lastName: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
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
              disabled={submitting}
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
