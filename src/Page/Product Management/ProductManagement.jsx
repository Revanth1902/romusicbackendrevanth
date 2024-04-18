import React, { useState, useEffect } from "react";
import SideBar from "../../Component/SideBar";
import ProductList from "./ProductManagementTable";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ListItem from "@mui/material/ListItem";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver"; // Import saveAs from file-saver
import * as XLSX from "xlsx";
import axios from "axios";
import Cookies from "js-cookie";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch products data from the API
  useEffect(() => {
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
          // Modify the data structure to include only required fields and capitalize the first letter
          const modifiedProducts = response.data.products.map((product) => ({
            Name: product.name.charAt(0).toUpperCase() + product.name.slice(1),
            Price: product.price,
            Stock: product.stock,
            Category:
              product.category.charAt(0).toUpperCase() +
              product.category.slice(1),
            SubCategory:
              product.subCategory.charAt(0).toUpperCase() +
              product.subCategory.slice(1),
            Brand:
              product.brand.charAt(0).toUpperCase() + product.brand.slice(1),
            Description: product.description,
            Specification: product.specification,
            WarrantyPeriod: product.warrantyPeriod,
          }));
          setProducts(modifiedProducts);
        } else {
          setProducts([]);
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle exporting products to Excel
  const exportToExcel = () => {
    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet([]);

    // Add headers to the worksheet
    const headers = [
      "Name",
      "Price",
      "Stock",
      "Category",
      "SubCategory",
      "Brand",
      "Description",
      "Specification",
      "WarrantyPeriod",
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    // Append products data to the worksheet
    const data = products.map((product) => [
      product.Name,
      product.Price,
      product.Stock,
      product.Category,
      product.SubCategory,
      product.Brand,
      product.Description,
      product.Specification,
      product.WarrantyPeriod,
    ]);
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A2" });

    // Create a workbook and add the worksheet-revanth
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Generate Excel file buffer-revanth
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Convert buffer to Blob-revanth
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save Blob as Excel file using FileSaver.js-revanth
    saveAs(blob, "products.xlsx");
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
              onClick={exportToExcel} // Call exportToExcel function on button click
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                Export Product
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
              Category Management
            </Button>
            {/* <Button sx={{ background: "orange" }} variant="contained">
              <AddIcon />
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                onClick={() => {
                  navigate("/addproduct");
                }}
              >
                Add Product
              </ListItem>
            </Button> */}
          </Box>
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
  );
}
