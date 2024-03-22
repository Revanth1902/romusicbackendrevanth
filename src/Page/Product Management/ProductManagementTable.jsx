import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
import Cookies from "js-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchCriteria, setSearchCriteria] = useState("name"); // State for search criteria
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  // Function to compare values for sorting
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/editproduct/${productId}`);
  };

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/product/${deleteProductId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProducts = stableSort(products, getComparator(order, orderBy));

  // Function to handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to handle search criteria change
  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  // Filter products based on search query and criteria
// Filter products based on search query and criteria
const filteredProducts = sortedProducts.filter((product) => {
  const fieldValue = String(product[searchCriteria]).toLowerCase();
  return fieldValue.includes(searchQuery);
});


  return (
    <div className="thethings">
      <h2>Product List</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by keyword"
          onChange={handleSearch}
          style={{
            padding: "19px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box",
            fontSize: "16px",
          }}
        />
        <FormControl
          style={{
            padding: "1px",
            borderRadius: "5px",
            width: "20%",
            maxWidth: "400px",
            boxSizing: "border-box",
            fontSize: "16px",
            marginBottom: "20px",
            height: "1px",
          }}
        >
          <Select
            value={searchCriteria}
            onChange={handleSearchCriteriaChange}
            displayEmpty
            inputProps={{ "aria-label": "Search Criteria" }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="subCategory">Sub Category</MenuItem>
            <MenuItem value="brand">Brand</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="stock">Stock</MenuItem>
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "subCategory"}
                    direction={orderBy === "subCategory" ? order : "asc"}
                    onClick={() => handleRequestSort("subCategory")}
                  >
                    Sub Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "brand"}
                    direction={orderBy === "brand" ? order : "asc"}
                    onClick={() => handleRequestSort("brand")}
                  >
                    Brand
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleRequestSort("price")}
                  >
                    Selling Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    {product.name.charAt(0).toUpperCase() +
                      product.name.slice(1)}
                  </TableCell>
                  <TableCell>{product.category.toUpperCase()}</TableCell>
                  <TableCell>
                    {product.subCategory.charAt(0).toUpperCase() +
                      product.subCategory.slice(1)}
                  </TableCell>
                  <TableCell>{product.brand.toUpperCase()}</TableCell>
                  <TableCell>₹ {product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product._id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(product._id)} // Changed to handleDeleteClick
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
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleDeleteCancel}>Cancel</button>
          <button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
