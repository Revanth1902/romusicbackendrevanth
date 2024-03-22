import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import "./brandsmanagement.css";
import SideBar from "../../Component/SideBar";
import Cookies from "js-cookie"; // Import Cookies library
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const BrandsManagement = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [order, setOrder] = useState("asc"); // State for sorting order
  const [orderBy, setOrderBy] = useState("brandName"); // State for sorting column

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = Cookies.get("token"); // Fetch user token from cookies
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/getAllBrands",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      setBrands(
        response.data.brands.map((brand) => ({
          ...brand,
          brandName: capitalizeFirstLetter(brand.brandName),
        }))
      ); // Capitalize brand names before setting them
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddBrand = async () => {
    if (newBrand.trim() !== "") {
      try {
        const token = Cookies.get("token"); // Fetch user token from cookies
        await axios.post(
          "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/brand/new",
          { brandName: newBrand.trim() },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        toast.success("Brand added successfully"); // Show success toast
        setNewBrand("");
        fetchBrands();
      } catch (error) {
        console.error("Error adding brand:", error);
        toast.error("Failed to add brand"); // Show error toast
      }
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      const token = Cookies.get("token"); // Fetch user token from cookies
      await axios.delete(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/brand/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      toast.success("Brand deleted successfully"); // Show success toast
      setBrands(brands.filter((brand) => brand._id !== brandId));
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand"); // Show error toast
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBrands = brands.slice().sort((a, b) => {
    const isAsc = order === "asc";
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="brands-management">
      <ToastContainer /> {/* Toast container */}
      <SideBar />
      <div className="add-brand">
        <input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="Enter brand name"
        />
        <button onClick={handleAddBrand}>Add Brand</button>
      </div>
      {brands.length === 0 ? (
        <div className="no-brands-message">No brands available or added.</div>
      ) : (
        <div className="brands-list">
          <div className="brands-header">
            <span onClick={() => handleSort("brandName")}>
              Brand Name
              {orderBy === "brandName" ? (
                order === "asc" ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )
              ) : null}
            </span>
          </div>
          {sortedBrands.map((brand) => (
            <div key={brand._id} className="brand-item">
              <span>{brand.brandName}</span>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteBrand(brand._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsManagement;
