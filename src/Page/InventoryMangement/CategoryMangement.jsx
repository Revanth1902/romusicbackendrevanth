import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../Component/SideBar";
import "./CategoryComponent.css"; // Import CSS file
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CategoryComponent = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [order, setOrder] = useState("asc"); // State for sorting order
  const [orderBy, setOrderBy] = useState("categoryName"); // State for sorting column

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/getAllCategories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add other headers if needed
          },
        }
      );
      const { categories } = response.data; // Extract categories from response
      setCategories(categories); // Set categories in state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const createCategory = async () => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/category/new",
        {
          categoryName: newCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      setNewCategoryName("");
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCategories = categories.slice().sort((a, b) => {
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
    <div className="category-container">
      <ToastContainer />
      <SideBar />
      <div className="create-category">
        <h3>Create New Category</h3>
        <input
          type="text"
          value={newCategoryName}
          onChange={handleNewCategoryChange}
        />
        <button onClick={createCategory}>Create</button>
      </div>
      <div className="categories-container">
        <h2 onClick={() => handleSort("categoryName")}>
          Categories{" "}
          {orderBy === "categoryName" ? (
            order === "asc" ? (
              <ArrowUpward />
            ) : (
              <ArrowDownward />
            )
          ) : null}
        </h2>
        <div className="category-list-container">
          <ul className="category-list">
            {sortedCategories.map((category) => (
              <li key={category._id} className="category-item">
                {category.categoryName.charAt(0).toUpperCase() +
                  category.categoryName.slice(1)}
                <IconButton
                  className="delete-icon"
                  color="secondary"
                  onClick={() => deleteCategory(category._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
