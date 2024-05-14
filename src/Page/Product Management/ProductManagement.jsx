import React, { useState } from "react";
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

  const handleClose = () => {
    setDialogOpen(false);
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
    </Box>
  );
};

export default ProductManagement;
