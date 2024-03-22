import React, { useState, useEffect } from "react";
import SideBar from "../../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Helper function to capitalize first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Component
const PaymentsManagementnewproduct = () => {
  // State variables
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [bestSeller, setBestSeller] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [mrp, setMrp] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [images, setImages] = useState([]); // State variable for selected images
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/getAllBrands",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const capitalizedBrands = response.data.brands.map((brand) => ({
        ...brand,
        brandName: capitalizeFirstLetter(brand.brandName),
      }));
      setBrands(capitalizedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/getAllCategories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const capitalizedCategories = response.data.categories.map(
        (category) => ({
          ...category,
          categoryName: capitalizeFirstLetter(category.categoryName),
        })
      );
      setCategories(capitalizedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(file); // Push the file directly
            setImages(newImages);
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error converting image to blob:", error);
          toast.error("Failed to convert image to blob");
        }
      }
    }
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("bestSeller", bestSeller);
      formData.append("featured", featured);
      formData.append("description", description);
      formData.append("specification", specification);
      formData.append("mrp", mrp);
      formData.append("warrantyPeriod", warrantyPeriod);
      for (let imag of images) {
        formData.append(`productImages`, imag);
      }
      const response = await axios.post(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/product/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setOpen(true);
        // Clear form data and images state
        setProductName("");
        setBrand("");
        setCategory("");
        setSubCategory("");
        setPrice("");
        setStock("");
        setBestSeller(false);
        setFeatured(false);
        setDescription("");
        setMrp("");
        setWarrantyPeriod("");
        setImages([]);
        setSpecification("");
        toast.success("Product added successfully");
      } else {
        console.error("Error adding product:", response.data.error);
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    navigate("/productmanagement");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Add New Product
          </Typography>
          <FormGroup>
            <TextField
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="brand-label">Select Brand</InputLabel>
              <Select
                labelId="brand-label"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.brandName}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Select Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Sub Category"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                  />
                }
                label="Best Seller"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                }
                label="Featured"
              />
            </Box>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Specification"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="MRP"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="warranty-period-label">
                Warranty Period
              </InputLabel>
              <Select
                labelId="warranty-period-label"
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
              >
                <MenuItem value="3 months">3 months</MenuItem>
                <MenuItem value="6 months">6 months</MenuItem>
                <MenuItem value="12 months">12 months</MenuItem>
                <MenuItem value="24 months">24 months</MenuItem>
                <MenuItem value="36 months">36 months</MenuItem>
                <MenuItem value="48 months">48 months</MenuItem>
              </Select>
            </FormControl>
            {/* Image upload */}
            {/* Image upload */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`image-upload-${index}`}
                  type="file"
                  onChange={(e) => handleImageChange(e, index)}
                />

                <label htmlFor={`image-upload-${index}`}>
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ mt: 2, mr: 2 }}
                  >
                    Select Image {index + 1}
                  </Button>
                </label>
                {/* Image preview */}
                {images[index] && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="h-full object-cover"
                      src={URL.createObjectURL(images[index])} // Use URL.createObjectURL() to create a preview
                      alt={`Image ${index + 1}`}
                      style={{
                        width: "200px",
                        height: "120px",
                        objectFit: "contain",
                        marginRight: "10px",
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => handleImageRemove(index)}
                      sx={{ mt: 2 }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Product button */}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Add Product
            </Button>
          </FormGroup>
        </Box>
      </Box>
      {/* Success dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Product Added</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            The product has been successfully added.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default PaymentsManagementnewproduct;
