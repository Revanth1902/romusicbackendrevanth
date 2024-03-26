import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import UpdateIcon from "@mui/icons-material/Update";
import CancelIcon from "@mui/icons-material/Cancel";
import { visuallyHidden } from "@mui/utils";

import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import axios from "axios";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import VisibilityIcon from "@mui/icons-material/Visibility";

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === "user") {
    return b.user.name.localeCompare(a.user.name);
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "user", numeric: false, disablePadding: false, label: "Customer Name" },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Order Date",
  },
  { id: "subtotal", numeric: true, disablePadding: false, label: "Subtotal" },
  { id: "discount", numeric: true, disablePadding: false, label: "Discount" },
  {
    id: "shippingCharges",
    numeric: true,
    disablePadding: false,
    label: "Shipping",
  },
  { id: "total", numeric: true, disablePadding: false, label: "Order Total" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" }, // Added status column
  { id: "actions", numeric: false, disablePadding: false, label: "Actions" }, // Added actions column
];

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null); // State to store selected date
  const [filterOpen, setFilterOpen] = React.useState(false); // State to manage filter dropdown visibility

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenPopup = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSelectedOrderDetails(response.data.order);
        setOpenPopup(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property); // Update orderBy state with the property being sorted

    // For sorting by name specifically
    if (property === "user") {
      // Use custom sorting function for name
      const sortedOrders = stableSort(orders, getComparator(order, "name"));
      setOrders(sortedOrders);
      return;
    }

    // For sorting by other columns
    const sortedOrders = stableSort(orders, getComparator(order, property));
    setOrders(sortedOrders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "DeepSkyBlue";
      case "Shipped":
        return "Goldenrod";
      case "Delivered":
        return "ForestGreen";
      default:
        return "inherit";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const filteredOrders = orders.filter((order) => {
    const nameMatch = order.user?.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const orderDateMatch = order.createdAt
      ? formatDate(order.createdAt).includes(searchText)
      : false;
    const subtotalMatch = order.subtotal
      ? order.subtotal.toString().includes(searchText)
      : false;
    const discountMatch = order.discount
      ? order.discount.toString().includes(searchText)
      : false;
    const shippingMatch = order.shippingCharges
      ? order.shippingCharges.toString().includes(searchText)
      : false;
    const statusMatch = order.status
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return (
      nameMatch ||
      orderDateMatch ||
      subtotalMatch ||
      discountMatch ||
      shippingMatch ||
      statusMatch
    );
  });

  const filteredByDateOrders = selectedDate
    ? filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt).toDateString();
        const selectedDateStr = selectedDate.toDateString();
        return orderDate === selectedDateStr;
      })
    : filteredOrders;

  const visibleOrders = stableSort(
    filteredByDateOrders,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleUpdateOrder = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/order/${id}`,
        {}, // Ensure you provide the necessary data to update the order if required
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Order updated successfully");
        // Refresh orders after updating
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Order cancelled successfully");
        // Refresh orders after cancelling
        fetchOrders();
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const DatePicker = ({ selected, onChange }) => (
    <input
      type="date"
      value={selected}
      onChange={(e) => onChange(new Date(e.target.value))}
      style={{ width: "40px" }}
    />
  );
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen); // Toggle filter dropdown
    if (!filterOpen) {
      // If filter is being closed, reset selectedDate to null
      setSelectedDate(null);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Customer Orders
              </Typography>
              <Paper
                component="form"
                sx={{
                  p: "0px 4px",
                  mr: 1.5,
                  display: "flex",
                  alignItems: "center",
                  width: 250,
                  border: "1px solid grey",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "search google maps" }}
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
                <IconButton type="button" sx={{ p: "0px 5px" }}>
                  <SearchIcon sx={{ height: 35 }} />
                </IconButton>
                <Divider sx={{ height: 25, m: 0.5 }} orientation="vertical" />
              </Paper>
              <Button
                className="OrderManagementButton"
                variant="contained"
                sx={{
                  background: "white",
                  color: "black",
                  p: "4.8px 15px",
                  mr: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={handleFilterToggle} // Toggle filter dropdown and clear filter if closing
              >
                <CalendarMonthIcon sx={{ mr: 1 }} />
                {selectedDate ? (
                  <Typography>{selectedDate.toLocaleDateString()}</Typography>
                ) : (
                  <Typography>Select Date</Typography>
                )}
              </Button>

              {filterOpen && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline // Display the calendar inline
                  style={{ width: "10%" }} // Adjust the width as needed
                />
              )}
            </Box>
          </Box>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label.charAt(0).toUpperCase() +
                        headCell.label.slice(1)}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No orders at this moment
                  </TableCell>
                </TableRow>
              ) : (
                visibleOrders.map((order, index) => {
                  const isItemSelected = isSelected(order._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={order._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        {order.user
                          ? order.user.name.charAt(0).toUpperCase() +
                            order.user.name.slice(1)
                          : "Not mentioned"}
                      </TableCell>
                      <TableCell align="left">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "Not mentioned"}
                      </TableCell>

                      <TableCell align="right">
                        {order.subtotal
                          ? `₹ ${order.subtotal}`
                          : "Not mentioned"}
                      </TableCell>

                      <TableCell align="right">
                        {order.discount
                          ? `₹ ${order.discount}`
                          : "Not mentioned"}
                      </TableCell>

                      <TableCell align="right">
                        {order.shippingCharges
                          ? `₹ ${order.shippingCharges}`
                          : "Not mentioned"}
                      </TableCell>

                      <TableCell align="right">
                        {order.total ? `₹ ${order.total}` : "Not mentioned"}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {order.status ? order.status : "Not mentioned"}
                      </TableCell>

                      <TableCell align="left">
                        <IconButton
                          onClick={() => handleOpenPopup(order._id)}
                          aria-label="view-details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleUpdateOrder(order._id)}
                          aria-label="update"
                        >
                          <UpdateIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleCancelOrder(order._id)}
                          aria-label="cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            User Information:
          </Typography>
          <Typography>
            <strong>Name:</strong>{" "}
            {selectedOrderDetails && selectedOrderDetails.user
              ? selectedOrderDetails.user.name.charAt(0).toUpperCase() +
                selectedOrderDetails.user.name.slice(1)
              : "N/A"}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Shipping Information:
          </Typography>
          {selectedOrderDetails && selectedOrderDetails.shippingInfo && (
            <Typography>
              <strong>Address:</strong>{" "}
              {selectedOrderDetails.shippingInfo.address} <br />
              <strong>City:</strong> {selectedOrderDetails.shippingInfo.city}{" "}
              <br />
              <strong>State:</strong> {selectedOrderDetails.shippingInfo.state}{" "}
              <br />
              <strong>Country:</strong>{" "}
              {selectedOrderDetails.shippingInfo.country} <br />
              <strong>Pin Code:</strong>{" "}
              {selectedOrderDetails.shippingInfo.pinCode}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Order Details:
          </Typography>
          {selectedOrderDetails &&
            selectedOrderDetails.orderItems &&
            selectedOrderDetails.orderItems.map((item) => (
              <div key={item._id}>
                <Typography variant="body1">
                  <strong>Product:</strong> {item.name} <br />
                  <strong>Price:</strong> ₹ {item.price.toFixed(2)} <br />
                  <strong>Quantity:</strong> {item.quantity} <br />
                  <strong>Warranty Period:</strong> {item.warrantyPeriod}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </div>
            ))}

          <Typography variant="h6" gutterBottom>
            Order Summary:
          </Typography>
          <Typography>
            <strong>Subtotal:</strong> ₹{" "}
            {selectedOrderDetails && selectedOrderDetails.subtotal
              ? selectedOrderDetails.subtotal.toFixed(2)
              : "N/A"}{" "}
            <br />
            <strong>Shipping Charges:</strong> ₹{" "}
            {selectedOrderDetails && selectedOrderDetails.shippingCharges
              ? selectedOrderDetails.shippingCharges.toFixed(2)
              : "N/A"}{" "}
            <br />
            <strong>Discount:</strong> ₹{" "}
            {selectedOrderDetails && selectedOrderDetails.discount
              ? selectedOrderDetails.discount.toFixed(2)
              : "N/A"}{" "}
            <br />
            <strong>Total:</strong> ₹{" "}
            {selectedOrderDetails && selectedOrderDetails.total
              ? selectedOrderDetails.total.toFixed(2)
              : "N/A"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
