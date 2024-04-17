import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import { ToastContainer, toast } from "react-toastify";

const BannerComponent = () => {
  const [loading, setLoading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    // Fetch categories here
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch categories from your API
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllCategories`
      );
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    if (
      filesToUpload.length < 1 ||
      selectedCategories.length < 1 ||
      !selectedOption
    ) {
      toast.error("Please select at least 1 image, category, and banner type");
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
  
    filesToUpload.forEach((file) => {
      formData.append("bannerImage", file);
    });
  
    selectedCategories.forEach((category) => {
      formData.append("categories", category);
    });
  
    formData.append("subCategory", selectedOption);
  
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/banner/new`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );
  
      const data = await res.json();
      setLoading(false);
  
      if (res.ok) {
        toast.success("Banner added successfully");
        // Navigate to "/inventorymanagement" after successful banner creation
        window.location.href = "/inventorymanagement";
      } else {
        toast.error(data.message || "Failed to add banner");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while adding the banner");
    }
  };
  
  

  const handleImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    setFilesToUpload((prevFiles) => [...prevFiles, ...fileList]);
    // Clear selected categories when changing the image
    setSelectedCategories([]);
  };
  

  const handleRemoveImage = (index) => {
    setFilesToUpload((prev) => prev.filter((_, i) => i !== index));
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (event, index) => {
    const category = event.target.value;
    setSelectedCategories((prev) => {
      const updatedCategories = [...prev];
      updatedCategories[index] = category;
      return updatedCategories;
    });
  };

  const renderImages = () => {
    const maxImages = 6;
    const displayedFiles = filesToUpload.slice(0, maxImages); // Limit to maximum 6 images
    const rows = [];
  
    for (let i = 0; i < displayedFiles.length; i += 2) {
      rows.push(
        <div key={i} style={{ display: "flex", marginBottom: "20px" }}>
          {displayedFiles[i] && (
            <div style={{ marginRight: "20px" }}>
              <div style={{ marginBottom: "10px" }}>
                <Button onClick={() => handleRemoveImage(i)}>
                  <CloseIcon />
                </Button>
                <img
                  className="h-40 object-cover"
                  style={{ width: "150px", height: "150px", marginRight: "10px" }}
                  src={URL.createObjectURL(displayedFiles[i])}
                  alt={`Image ${i}`}
                />
              </div>
              <div>
                <label htmlFor={`category${i}`}>
                  Select Category for Image {i + 1}:
                </label>
                <select
                  id={`category${i}`}
                  value={selectedCategories[i] || ""}
                  onChange={(e) => handleCategoryChange(e, i)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {allCategories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {displayedFiles[i + 1] && (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <Button onClick={() => handleRemoveImage(i + 1)}>
                  <CloseIcon />
                </Button>
                <img
                  className="h-40 object-cover"
                  style={{ width: "150px", height: "150px", marginRight: "10px" }}
                  src={URL.createObjectURL(displayedFiles[i + 1])}
                  alt={`Image ${i + 1}`}
                />
              </div>
              <div>
                <label htmlFor={`category${i + 1}`}>
                  Select Category for Image {i + 2}:
                </label>
                <select
                  id={`category${i + 1}`}
                  value={selectedCategories[i + 1] || ""}
                  onChange={(e) => handleCategoryChange(e, i + 1)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {allCategories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      );
    }
  
    return <>{rows}</>;
  };
  

  return (
    <>
      <SideBar />
      <div
        className="flex justify-center items-center h-full"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin:"9%"
        }}
      >
        <div className="text-center">
          <label htmlFor="imageInput" className="custom-file-upload">
            Choose Images
          </label>
          <input
            id="imageInput"
            type="file"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
          <div>{renderImages()}</div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <label htmlFor="bannerType" style={{ marginRight: "10px" }}>
              Select Banner Type:
            </label>
            <select
              id="bannerType"
              value={selectedOption}
              onChange={handleSelectChange}
              style={{
                padding: "8px 12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                marginLeft: "10px",
              }}
            >
              <option value="">Select Banner Type</option>
              <option value="mainbanner">Main Banner</option>
              <option value="productbanner">Product Banner</option>
            </select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: "20px",
              backgroundColor: "#f58634",
              color: "#ffffff", // Set text color to white for better contrast
              border: "none", // Remove button border
              padding: "5px 20px", // Add padding for better appearance
              borderRadius: "5px", // Add border radius for rounded corners
              cursor: "pointer", // Change cursor to pointer on hover
            }}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "#ffffff" }} />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
};

export default BannerComponent;
