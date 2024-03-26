import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import "./editproduct.css";
import { useNavigate } from "react-router-dom";

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
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Added state to track selected image index

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
          <label>Warranty Period:</label>
          <input
            type="text"
            name="warrantyPeriod"
            value={product.warrantyPeriod}
            onChange={handleChange}
          />
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
