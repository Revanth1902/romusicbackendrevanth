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
import { useNavigate, useParams } from "react-router-dom";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    productName: "",
    brand: "",
    subCategories: [],
    selectedCategory: "",
    category: "",
    subCategory: "",
    price: "",
    mrp: "",
    stock: "",
    bestSeller: false,
    featured: false,
    description: "",
    specification: "",
    warrantyPeriod: "",
    images: [],
  });

  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/product/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.product;
        setProduct({
          productName: data.name,
          brand: data.brand,
          subCategories: [],
          selectedCategory: data.category,
          category: data.category,
          subCategory: data.subCategory,
          price: data.price,
          mrp: data.mrp,
          stock: data.stock,
          bestSeller: data.bestSeller,
          featured: data.featured,
          description: data.description,
          specification: data.specification,
          warrantyPeriod: data.warrantyPeriod,
          images: data.productImages,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllBrands`,
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

  const fetchCategories = async () => {
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

  const handleImageChange = (files, index) => {
    if (files) {
      const newImages = [...product.images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(file); // Push the file directly
            setProduct((prevProduct) => ({
              ...prevProduct,
              images: newImages,
            }));
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error converting image to blob:", error);
          toast.error("Failed to convert image to blob");
        }
      }
    }
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;
    if (/^\d+$/.test(value) || value === "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        price: value,
      }));
    }
  };

  const handleMRPChange = (e) => {
    const { value } = e.target;
    if (/^\d+$/.test(value) || value === "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        mrp: value,
      }));
    }
  };

  const handleStockChange = (e) => {
    const { value } = e.target;
    if (/^\d+$/.test(value) || value === "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        stock: value,
      }));
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (submitting) return;
      setSubmitting(true);
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("name", product.productName);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("subCategory", product.subCategory);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("bestSeller", product.bestSeller);
      formData.append("featured", product.featured);
      formData.append("description", product.description);
      formData.append("specification", product.specification);
      formData.append("mrp", product.mrp);
      formData.append("warrantyPeriod", product.warrantyPeriod);
      for (let imag of product.images) {
        formData.append(`productImages`, imag);
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/product/${id}`,
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
        toast.success("Product updated successfully");
      } else {
        console.error("Error updating product:", response.data.error);
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/productmanagement");
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );
    setProduct((prevProduct) => ({
      ...prevProduct,
      selectedCategory: categoryId,
      category: selectedCategory.categoryName,
      subCategories: [],
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
        <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              label="Product Name"
              value={product.productName}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  productName: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
              sx={{ width: "70%" }}
            />
            <FormControl sx={{ width: "30%", marginTop: "0.6%" }}>
              <InputLabel id="brand-label">Select Brand</InputLabel>
              <Select
                labelId="brand-label"
                value={product.brand}
                onChange={(e) =>
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    brand: e.target.value,
                  }))
                }
                fullWidth
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.brandName}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormControl sx={{ flex: 1, marginTop: "0.7%" }}>
              <InputLabel id="category-label">Select Category</InputLabel>
              <Select
                labelId="category-label"
                value={product.selectedCategory}
                onChange={handleCategoryChange}
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {product.selectedCategory && (
              <FormControl sx={{ flex: 1, marginTop: "0.7%" }}>
                <InputLabel id="subcategory-label">
                  Select Subcategory
                </InputLabel>
                <Select
                  labelId="subcategory-label"
                  value={product.subCategory}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      subCategory: e.target.value,
                    }))
                  }
                  fullWidth
                >
                  {product.subCategories.map((subCategory) => (
                    <MenuItem
                      key={subCategory._id}
                      value={subCategory.subCategoryName}
                    >
                      {subCategory.subCategoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <Box sx={{ display: "flex" }}>
            <TextField
              label="Price"
              value={product.price}
              onChange={handlePriceChange}
              fullWidth
              margin="normal"
              type="number"
              sx={{ mr: 1 }}
            />

            <TextField
              label="MRP"
              value={product.mrp}
              onChange={handleMRPChange}
              fullWidth
              margin="normal"
              type="number"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <TextField
              label="Stock"
              value={product.stock}
              onChange={handleStockChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl
              margin="normal"
              style={{ width: "50%", marginLeft: 1 }}
            >
              <InputLabel id="warranty-period-label">
                Warranty Period
              </InputLabel>
              <Select
                labelId="warranty-period-label"
                value={product.warrantyPeriod}
                onChange={(e) =>
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    warrantyPeriod: e.target.value,
                  }))
                }
              >
                <MenuItem value="no warranty">No Warranty</MenuItem>
                <MenuItem value="3 months">3 months</MenuItem>
                <MenuItem value="6 months">6 months</MenuItem>
                <MenuItem value="12 months">12 months</MenuItem>
                <MenuItem value="24 months">24 months</MenuItem>
                <MenuItem value="36 months">36 months</MenuItem>
                <MenuItem value="48 months">48 months</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", width: "50%" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={product.bestSeller}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      bestSeller: e.target.checked,
                    }))
                  }
                />
              }
              label="Best Seller"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={product.featured}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      featured: e.target.checked,
                    }))
                  }
                />
              }
              label="Featured"
            />
          </Box>

          <TextField
            label="Description"
            value={product.description}
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                description: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Specification"
            value={product.specification}
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                specification: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Typography variant="h6" gutterBottom>
            Product Images
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    flexBasis: "30%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id={`image-upload-${index}`}
                    type="file"
                    onChange={(e) => handleImageChange(e.target.files, index)}
                  />
                  <label htmlFor={`image-upload-${index}`}>
                    <Button variant="contained" component="span">
                      Select Image {index + 1}
                    </Button>
                  </label>
                  {product.images[index] && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={product.images[index]}
                        alt={`Image ${index + 1}`}
                        style={{ width: "100px", height: "auto" }}
                      />

                      <Button
                        variant="outlined"
                        onClick={() => handleImageRemove(index)}
                        sx={{ ml: 1 }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? "Updating..." : "Update Product"}
          </Button>
        </FormGroup>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Product Updated</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            The product has been successfully updated.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default EditProduct;
