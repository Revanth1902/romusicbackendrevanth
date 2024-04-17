import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sub.css";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../Component/SideBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    disc: "",
    amount: "",
    timePeriod: "", // Added timePeriod field
    image: null,
  });
  const [updatingSubscriptionId, setUpdatingSubscriptionId] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/subscription/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.error(response.data.message);
      } else {
        setSubscriptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDelete = async (subsId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/subscription/delete/${subsId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.error("Failed to delete subscription");
      } else {
        toast.success("Subscription deleted successfully");
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    }
  };

  const handleCreateSubscription = async () => {
    setLoading(true);
    try {
      const amount = parseInt(formData.amount);
      const timePeriodInMonths = parseInt(formData.timePeriod); // Parse timePeriod to integer
      if (
        isNaN(amount) ||
        amount <= 0 ||
        isNaN(timePeriodInMonths) || // Check if timePeriod is not a number
        timePeriodInMonths <= 0 || // Check if timePeriod is less than or equal to 0
        !Number.isInteger(timePeriodInMonths) || // Check if timePeriod is not an integer
        formData.amount.toString().includes(".") // Check if amount contains decimal points
      ) {
        toast.error(
          "Please provide a valid amount and time period (in months)"
        );
        return;
      }
  
      const token = Cookies.get("token");
      const formDataWithImage = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Check if the key is 'image' and value is not null or empty
        if (key === 'image' && !value) return; // Skip appending if image is empty
        formDataWithImage.append(key, value);
      });
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/subscription/new`,
        formDataWithImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.error("Failed to create subscription");
      } else {
        toast.success("Subscription created successfully");
        setOpenAddDialog(false);
        fetchSubscriptions();
        setFormData({
          name: "",
          disc: "",
          amount: "",
          timePeriod: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };
  

  
  

  const handleUpdateSubscription = async () => {
    setLoading(true);
    try {
      const amount = parseInt(formData.amount);
      const timePeriodInMonths = parseInt(formData.timePeriod); // Parse timePeriod to integer
      if (
        isNaN(amount) ||
        amount <= 0 ||
        isNaN(timePeriodInMonths) || // Check if timePeriod is not a number
        timePeriodInMonths <= 0 || // Check if timePeriod is less than or equal to 0
        !Number.isInteger(timePeriodInMonths) || // Check if timePeriod is not an integer
        formData.amount.toString().includes(".") // Check if amount contains decimal points
      ) {
        toast.error(
          "Please provide a valid amount and time period (in months)"
        );
        return;
      }
  
      const token = Cookies.get("token");
      const formDataWithoutImage = { ...formData }; // Create a copy of formData
      delete formDataWithoutImage.image; // Remove image field from the copy
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/subscription/updateSubsDetails/${updatingSubscriptionId}`,
        formDataWithoutImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const imageUrl = response.data.data.image; // Get the updated image URL from the response
        const formDataWithImage = new FormData();
        if (formData.image) {
          formDataWithImage.append("image", formData.image); // Add the image file to FormData
          // Upload the image separately
          await axios.put(
            `${process.env.REACT_APP_BASE_URL}/admin/subscription/updateSubsImage/${updatingSubscriptionId}`,
            formDataWithImage,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
  
        toast.success(response.data.message || "Subscription updated successfully");
        setOpenEditDialog(false);
        fetchSubscriptions();
        setFormData({
          name: "",
          disc: "",
          amount: "",
          timePeriod: "",
          image: null,
        });
      } else {
        toast.error(response.data.message || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setFormData({
      name: "",
      disc: "",
      amount: "",
      timePeriod: "",
      image: null,
    });
  };

  const handleOpenEditDialog = (subscriptionId) => {
    setUpdatingSubscriptionId(subscriptionId);
    setOpenEditDialog(true);
    const subscriptionToUpdate = subscriptions.find(
      (subscription) => subscription._id === subscriptionId
    );
    setFormData({
      name: subscriptionToUpdate.name,
      disc: subscriptionToUpdate.disc,
      amount: subscriptionToUpdate.amount,
      timePeriod: subscriptionToUpdate.timePeriod, // Set timePeriod field
      image: null,
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ width: "100%", p: 2, marginTop: "5%" }}>
        <Button
          sx={{ background: "orange" }}
          variant="contained"
          onClick={handleOpenAddDialog}
        >
          Create Subscription
        </Button>
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : subscriptions.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {subscriptions.map((subscription) => (
              <div
                key={subscription._id}
                className="card"
                style={{
                  boxShadow:
                    subscription.amount === 100
                      ? "0 0 25px rgba(192, 192, 192, 0.5)"
                      : "0 0 25px rgba(255, 215, 0, 0.5)",
                }}
              >
                <div className="pricing-block-content">
                  <img
                    src={subscription.image}
                    alt=""
                    style={{
                      width: "200px",
                      height: "auto",
                      alignSelf: "center",
                    }}
                  />
                  <h1 style={{ alignSelf: "center" }}>
                    {subscription.name.charAt(0).toUpperCase() +
                      subscription.name.slice(1)}
                  </h1>

                  <Typography variant="body1" style={{ alignSelf: "center" }}>
                    {subscription.disc}
                  </Typography>
                  <h2 style={{ alignSelf: "center" }}>
                    ₹{subscription.amount}
                  </h2>
                  <h3 style={{ alignSelf: "center" }}>
                    Validity: {subscription.timePeriod} Months
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DeleteIcon
                      onClick={() => handleDelete(subscription._id)}
                      style={{ marginRight: "5%" }}
                    />
                    <EditIcon
                      onClick={() => handleOpenEditDialog(subscription._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="body1">No subscriptions available</Typography>
        )}
      </Box>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Subscription</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="disc"
            label="Description"
            value={formData.disc}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="timePeriod"
            label="Time Period (Months)"
            value={formData.timePeriod}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleInputChange}
          />
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              style={{
                width: "200px",
                height: "auto",
                alignSelf: "center",
                marginTop:"1%"
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateSubscription}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="primary" /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="disc"
            label="Description"
            value={formData.disc}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="timePeriod"
            label="Time Period"
            value={formData.timePeriod}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleInputChange}
          />
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              style={{
                width: "200px",
                height: "auto",
                alignSelf: "center",
                marginTop:"1%"
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateSubscription}
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default SubscriptionManagement;
