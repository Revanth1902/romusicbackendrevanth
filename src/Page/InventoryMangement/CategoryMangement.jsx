import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../../Component/SideBar";

const CategoryComponent = () => {
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category ID

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllSubCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubcategories(response.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  // Update handleNewSubcategoryChange to set newSubcategoryName state
  const handleNewSubcategoryChange = (e) => {
    setNewSubcategoryName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0])); // Set image preview
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const createCategory = async () => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("categoryName", newCategoryName);
      formData.append("image", image);
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/category/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchCategories();
      setNewCategoryName("");
      setImage(null);
      setImagePreview(null);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    }
  };

  const createSubcategory = async () => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/subCategory/new`,
        {
          subCategoryName: newSubcategoryName,
          categoryId: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubcategories();
      setNewCategoryName("");
      setSelectedCategory("");
      toast.success("Subcategory created successfully!");
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("Error creating subcategory");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/category/${categoryId}`,
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

  const deleteSubcategory = async (subcategoryId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/subCategory/${subcategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubcategories();
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error deleting subcategory");
    }
  };

  const renderCategoriesWithSubcategories = () => {
    const filteredCategoriesList = searchQuery
      ? categories.filter((category) =>
          category.categoryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : categories;
    const filteredSubcategoriesList = searchQuery
      ? subcategories.filter((subcategory) =>
          subcategory.subCategoryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : subcategories;

    return filteredCategoriesList.map((category) => {
      const categorySubcategories = filteredSubcategoriesList.filter(
        (subcategory) => subcategory.categoryId === category._id
      );

      return (
        <React.Fragment key={category._id}>
          <TableRow>
            <TableCell >
              <strong>
                {category.categoryName.charAt(0).toUpperCase() +
                  category.categoryName.substring(1)}
              </strong>
            </TableCell>
            <TableCell>
              {categorySubcategories.length > 0 ? (
                categorySubcategories.map((subcategory) => (
                  <div
                    key={subcategory._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {subcategory.subCategoryName.charAt(0).toUpperCase() +
                      subcategory.subCategoryName.substring(1)}
                    <IconButton
                      onClick={() => deleteSubcategory(subcategory._id)}
                    >
                      <DeleteIcon style={{ color: "orange" }} />
                    </IconButton>
                  </div>
                ))
              ) : (
                <p>No subcategories</p>
              )}
            </TableCell>
            <TableCell>
              <IconButton onClick={() => deleteCategory(category._id)}>
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      <SideBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div>
          <h3>Create New Category</h3>
          <TextField
            type="text"
            value={newCategoryName}
            onChange={handleNewCategoryChange}
            label="Category Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <input
            accept="image/*"
            id="category-image"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="category-image">
            <Button
              variant="contained"
              component="span"
              color="primary"
              sx={{ background: "orange", marginTop: "10px" }}
            >
              Upload Image
            </Button>
          </label>
          {imagePreview && (
            <img
              style={{ width: "200px", height: "200px" }}
              src={imagePreview}
              alt="Preview"
            />
          )}
          {/* Image preview */}
          <Button
            variant="contained"
            color="primary"
            sx={{ background: "orange", marginTop: "10px" }}
            onClick={createCategory}
          >
            Create Category
          </Button>
        </div>
        <div>
          <h3>Create New Subcategory</h3>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            value={newSubcategoryName}
            onChange={handleNewSubcategoryChange}
            label="Subcategory Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ background: "orange", marginTop: "10px" }}
            onClick={createSubcategory}
          >
            Create Subcategory
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ width: "80%", marginTop: 20 }}>
              <div style={{ marginTop: "20px" }}>
                <TextField
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  style={{ width: "30%" }}
                />
              </div>
              <h3>Categories with Subcategories</h3>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Name</TableCell>
                      <TableCell>Subcategory Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderCategoriesWithSubcategories()}</TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default CategoryComponent;
