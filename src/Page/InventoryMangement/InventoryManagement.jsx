import React, { useState, useEffect } from "react";
import SideBar from "../../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function InventoryManagement() {
  const [banners, setBanners] = useState([]);
  const [sortByCategory, setSortByCategory] = useState(""); // State to handle sorting

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const fetchAllBanners = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/getAllBanners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanners(
        response.data.allBanner.map((banner) => ({
          ...banner,
          category:
            banner.category.charAt(0).toUpperCase() + banner.category.slice(1),
        }))
      );
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `https://e-commerce-backend-2ltj.onrender.com/api/v1/admin/banner/${bannerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Remove the deleted banner from the state
        setBanners((prevBanners) =>
          prevBanners.filter((banner) => banner._id !== bannerId)
        );
      } else {
        console.error("Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleSortByCategory = () => {
    // Toggle sorting between ascending and descending
    if (sortByCategory === "asc") {
      setSortByCategory("desc");
      setBanners((prevBanners) =>
        [...prevBanners].sort((a, b) => b.category.localeCompare(a.category))
      );
    } else {
      setSortByCategory("asc");
      setBanners((prevBanners) =>
        [...prevBanners].sort((a, b) => a.category.localeCompare(b.category))
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, marginTop: "55px", position: "relative" }}
      >
        <Box sx={{ marginTop: "1rem" }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ background: "orange" }}
                variant="contained"
                component={Link}
                to="/addbanner"
              >
                Add Banner
              </Button>

              <Button
                sx={{ background: "orange" }}
                variant="contained"
                component={Link}
                to="/brandmanagement"
              >
                <AddIcon sx={{ mr: 1 }} />
                Brand Management
              </Button>
              <Button
                sx={{ background: "orange" }}
                variant="contained"
                component={Link}
                to="/categorymanagement"
              >
                <AddIcon sx={{ mr: 1 }} />
                Category Management
              </Button>
            </Box>

            <Box>
              {/* Fixed headers */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 0.7fr",
                  gap: "10px",
                  alignItems: "center",
                  borderBottom: "1px solid #ccc",
                  pb: "10px",
                  marginTop: "5%",
                }}
              >
                <Typography variant="h6">Banner Images</Typography>
                <Typography variant="h6">
                  Category Name
                  {sortByCategory === "asc" ? (
                    <ArrowUpwardIcon onClick={handleSortByCategory} />
                  ) : (
                    <ArrowDownwardIcon onClick={handleSortByCategory} />
                  )}
                </Typography>

                <Typography variant="h6">Actions</Typography>
              </Box>

              {/* Render banners data */}
              {banners.map((banner, index) => (
                <React.Fragment key={banner._id}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      gap: "10px",
                      alignItems: "center",
                      pt: "10px",
                    }}
                  >
                    {/* Render multiple banner images */}
                    <Box>
                      {banner.bannerImages.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Banner ${idx + 1}`}
                          style={{ width: "200px", height: "auto" }}
                        />
                      ))}
                    </Box>
                    <Typography>{banner.category}</Typography>

                    <Button
                      onClick={() => handleDeleteBanner(banner._id)}
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>
                  {index !== banners.length - 1 && (
                    <Box
                      sx={{
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        mt: "10px",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
