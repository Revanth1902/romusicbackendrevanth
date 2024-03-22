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
import { visuallyHidden } from "@mui/utils";

import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import axios from "axios";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";

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

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/orders/all",
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  const filteredOrders = orders.filter((order) =>
    order.user?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const visibleOrders = stableSort(
    filteredOrders,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
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
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  sx={{
                    background: "white",
                    color: "black",
                    p: "4.8px 15px",
                    mr: 1.5,
                  }}
                  startIcon={<CalendarMonthIcon />}
                >
                  Filter
                </Button>
              </Box>
            </Box>
          )}

          {selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton className="OrderManagementButton">
                <FilterListIcon sx={{}} />
              </IconButton>
            </Tooltip>
          )}
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
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
                      onClick={(event) => handleClick(event, order._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={order._id}
                      selected={isItemSelected}
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
                        {order.total ? `₹   ${order.total}` : "Not mentioned"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
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
    </Box>
  );
}
