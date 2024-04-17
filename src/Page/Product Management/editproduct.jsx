import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import "./editproduct.css";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    mrp: 0,
    stock: 0,
    category: "",
    description: "",
    specification: "",
    brand: "",
    subCategory: "",
    warrantyPeriod: "",
    productImages: [], // Added productImages array
    featured: false, // Added featured property
    bestSeller: false, // Added bestSeller property
    isVerified: "false", // Added isVerified property
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Added state to track selected image index
  const [isVerified, setIsVerified] = useState(product.isVerified);

  useEffect(() => {
    fetchProduct();
    fetchBrands();
    fetchCategories();
  }, []);

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
      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        toast.error("Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product");
    }
  };

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
      if (response.data.success) {
        setBrands(response.data.brands);
      } else {
        toast.error("Failed to fetch brands");
      }
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
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };
  const handleVerificationChange = (event) => {
    setIsVerified(event.target.value);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a copy of productImages array
        const updatedProductImages = [...product.productImages];
        // Replace the selected image URL with the new one
        updatedProductImages[selectedImageIndex] = reader.result;
        // Update the product state
        setProduct({ ...product, productImages: updatedProductImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("mrp", product.mrp);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("specification", product.specification);
      formData.append("brand", product.brand);
      formData.append("subCategory", product.subCategory);
      formData.append("warrantyPeriod", product.warrantyPeriod);
      formData.append("isVerified", isVerified); // Include isVerified
      if (product.image) {
        formData.append("productImages", product.image);
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
        toast.success("Product updated successfully");
        setTimeout(() => {
          navigate("/productmanagement");
        }, 3000);
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <>
      <SideBar />
      <div className="edit-product-container">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
          <label>MRP:</label>
          <input
            type="number"
            name="mrp"
            value={product.mrp}
            onChange={handleChange}
          />
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          />
          <label>Category:</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={10}
          />
          <label>Specification:</label>
          <textarea
            name="specification"
            value={product.specification}
            onChange={handleChange}
            rows={10}
          />
          <label>Brand:</label>
          <select name="brand" value={product.brand} onChange={handleChange}>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.brandName}>
                {brand.brandName}
              </option>
            ))}
          </select>
          <label>Sub Category:</label>
          <input
            type="text"
            name="subCategory"
            value={product.subCategory}
            onChange={handleChange}
          />
          <label htmlFor="warranty-period">Warranty Period:</label>
          <select
            id="warranty-period"
            name="warrantyPeriod"
            value={product.warrantyPeriod}
            onChange={handleChange}
          >
            <option value="no warranty">No Warranty</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
            <option value="24 months">24 months</option>
            <option value="36 months">36 months</option>
            <option value="48 months">48 months</option>
          </select>

          <label>Featured:</label>
          <Switch
            checked={product.featured}
            onChange={(e) =>
              setProduct({ ...product, featured: e.target.checked })
            }
            color="primary"
          />
          <label>Best Seller:</label>
          <Switch
            checked={product.bestSeller}
            onChange={(e) =>
              setProduct({ ...product, bestSeller: e.target.checked })
            }
            color="primary"
          />

          <label>Is Verified:</label>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="verification"
              name="verification"
              value={isVerified}
              onChange={handleVerificationChange}
              row
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label={
                  <CheckCircleIcon
                    style={{
                      color: isVerified === "true" ? "green" : "inherit",
                    }}
                  />
                }
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label={
                  <CancelIcon
                    style={{
                      color: isVerified === "false" ? "red" : "inherit",
                    }}
                  />
                }
              />
            </RadioGroup>
          </FormControl>

          <div>
            {product.productImages.length > 0 ? (
              product.productImages.map((image, index) => (
                <div key={index} className="image-item">
                  <label>Image {index + 1}</label>
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="product-image"
                  />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                </div>
              ))
            ) : (
              <div className="no-image">No image found</div>
            )}
          </div>
          <button type="submit">Update Product</button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default EditProduct;
