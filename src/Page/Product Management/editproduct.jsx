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
    isVerified: false, // Added isVerified property
    featured: false, // Added featured property
    bestSeller: false, // Added bestSeller property
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [changedImage, setChangedImage] = useState(null);

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
        // Store unchanged images
        setChangedImage(null); // Clear the changed image preview
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

  const handleToggle = (property) => {
    setProduct((prevProduct) => {
      return { ...prevProduct, [property]: !prevProduct[property] };
    });
  };

  const handleImageChange = (action, index, file) => {
    const newImages = [...product.productImages];

    if (action === "change" && file) {
      // Change image
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages[index] = file; // Update the specific image at the given index
        setProduct({ ...product, productImages: newImages });
        setChangedImage(reader.result); // Store updated image preview
      };
      reader.readAsDataURL(file);
    } else if (action === "remove") {
      // Remove image
      newImages.splice(index, 1);
      setProduct({ ...product, productImages: newImages });
    } else if (action === "add" && file) {
      // Add new image
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(file); // Add the new image to the end of the array
        setProduct({ ...product, productImages: newImages });
        setChangedImage(reader.result); // Store updated image preview
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other cases or show an error message
      console.error("Invalid action or missing file:", action, file);
      toast.error("Invalid action or missing file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      product.price <= 0 ||
      product.mrp <= 0 ||
      product.stock < 0 ||
      !Number.isInteger(parseFloat(product.price)) ||
      !Number.isInteger(parseFloat(product.mrp)) ||
      !Number.isInteger(parseFloat(product.stock))
    ) {
      toast.error(
        "Price and MRP must be positive integers. Stock can't be negative."
      );
      return;
    }
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("mrp", product.mrp);
      formData.append("stock", product.stock); // Include stock in formData
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("specification", product.specification);
      formData.append("brand", product.brand);
      formData.append("subCategory", product.subCategory);
      formData.append("warrantyPeriod", product.warrantyPeriod);
      formData.append("isVerified", product.isVerified);
      formData.append("featured", product.featured);
      formData.append("bestSeller", product.bestSeller);

      // Create an array to store promises for each image conversion
      const imageConversionPromises = [];

      // Append all product images (changed and unchanged)
      product.productImages.forEach((image, index) => {
        if (typeof image === "string") {
          // Existing images are URLs, convert them to files
          const promise = fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
              formData.append(`productImages`, blob, `image${index}.png`);
            })
            .catch((error) => {
              console.error("Error converting URL to blob:", error);
            });
          imageConversionPromises.push(promise);
        } else {
          // New images are already files, append them directly
          formData.append(`productImages`, image);
        }
      });

      // Wait for all image conversion promises to resolve
      await Promise.all(imageConversionPromises);

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
            onChange={handleChange} // Ensure stock value is updated
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

          <div>
            <div className="toggle-group">
              <label className="toggle-label">Is Verified:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={product.isVerified === true}
                  onChange={() => handleToggle("isVerified")}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-group">
              <label className="toggle-label">Best Seller:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={product.bestSeller}
                  onChange={() => handleToggle("bestSeller")}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-group">
              <label className="toggle-label">Featured:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={() => handleToggle("featured")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div>
            {product.productImages.map((image, index) => (
              <div key={index} className="image-item">
                <label>Image {index + 1}</label>
                <img
                  style={{ width: "200px", height: "200px" }}
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Product ${index + 1}`}
                  className="product-image"
                />
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = "image/*";
                      fileInput.onchange = (event) => {
                        const file = event.target.files[0];
                        if (file) {
                          handleImageChange("change", index, file);
                        }
                      };
                      fileInput.click();
                    }}
                    className="change-image-button"
                  >
                    Change Image
                  </button>

                  <button
                    type="button"
                    onClick={() => handleImageChange("remove", index, null)}
                    className="remove-image-button"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ))}

            {product.productImages.length < 6 && (
              <div className="image-item">
                <label>Add Image:</label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleImageChange(
                      "add", // Action: "add" for adding a new image
                      null, // No need for index when adding a new image
                      e.target.files[0] // Only the first selected file
                    )
                  }
                  className="image-input"
                />
              </div>
            )}
          </div>
          <button
            className="submitbutton"
            type="submit"
            style={{
              marginTop: "2%",
              width: "30%",
              marginLeft: "35%", // Adjust the left margin as needed
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "0.3s ease",
            }}
          >
            Update Product
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default EditProduct;
