import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import axios from "axios";
import { toast } from "react-toastify";
import StockCheckPopup from "./stockcheckpopup";
import { ToastContainer } from "react-toastify";
import SideBar from "../../Component/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ProductList from "./ProductManagementTable";
import AddIcon from "@mui/icons-material/Add";
import ListItem from "@mui/material/ListItem";
import CategorySubcategoryDialog from "./showschemamodel";
import categoriesAndSubs from "./categoriesandsub.json"; // Import your category and subcategory data
import { Link } from "react-router-dom";
const ProductManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const showPopupForCategoriesAndSubs = () => {
    setDialogOpen(true);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/products`,
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
    }
  };
  const [popupOpen, setPopupOpen] = useState(false);

  // Filter products with stock less than 5
  const lowStockProducts = products.filter((product) => product.stock < 5);
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleStockCheck = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ marginTop: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              sx={{ background: "orange" }}
              variant="contained"
              onClick={showPopupForCategoriesAndSubs}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                Category Management
              </ListItem>
            </Button>
            <Button
              sx={{ background: "orange" }}
              variant="contained"
              component={Link}
              to="/brandmanagement"
            >
              <AddIcon sx={{ mr: 1 }} />
              Brand Management
            </Button>
            <Button
              sx={{
                background: lowStockProducts.length > 0 ? "red" : "green",
                paddingRight: "50px",
              }}
              variant="contained"
              onClick={handleStockCheck}
            >
              Stock
              {lowStockProducts.length > 0 ? (
                <WarningIcon
                  sx={{ position: "absolute", top: "5px", right: "5px" }}
                />
              ) : (
                <CheckCircleOutlineIcon  sx={{ position: "absolute", top: "5px", right: "5px" }}/>
              )}
            </Button>

            <Button
              sx={{ background: "orange" }}
              variant="contained"
              component={Link}
              to="/categorymanagement"
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Category
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              marginBottom: "15px",
            }}
          >
            <ProductList setProducts={setProducts} />{" "}
            {/* Pass setProducts function as prop */}
          </Box>
        </Box>
      </Box>
      <CategorySubcategoryDialog
        open={dialogOpen}
        handleClose={handleClose}
        data={categoriesAndSubs}
      />
      <StockCheckPopup
        open={popupOpen}
        handleClose={handleClosePopup}
        products={lowStockProducts}
      />
    </Box>
  );
};

export default ProductManagement;
