import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addbanner.css";
import SideBar from "../../Component/SideBar";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BannerComponent = () => {
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchCategoryOptions();
  }, []);

  const fetchCategoryOptions = async () => {
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
        setCategoryOptions(
          response.data.categories.map((category) => ({
            ...category,
            categoryName: capitalizeFirstLetter(category.categoryName),
          }))
        );
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = [...previewImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push({ file, src: reader.result });
          setPreviewImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedCategory || previewImages.length === 0) {
        toast.error("Please select a category and upload at least one image.");
        return;
      }

      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("category", selectedCategory);
      previewImages.forEach((image) => {
        formData.append("bannerImages", image.file);
      });
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/banner/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Banner created successfully");
        navigate("/inventorymanagement  ");
        setPreviewImages([]);
        setSelectedCategory("");
      } else {
        toast.error("Failed to create banner");
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error("Failed to create banner");
    }
  };

  return (
    <div>
      <SideBar />
      <div className="banner-container">
        <h2>Create New Banner</h2>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image">Banner Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            multiple // Allow multiple file selection
          />
        </div>
        {previewImages.length > 0 && (
          <div className="theimagepreview">
            <h3>Preview:</h3>
            {previewImages.map((image, index) => (
              <div
                key={index}
                style={{ marginBottom: "10px" }}
                className="theimagepreview2"
              >
                <img src={image.src} alt={`Banner Preview ${index + 1}`} />
                <button onClick={() => handleImageRemove(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleSubmit}>Submit</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BannerComponent;
