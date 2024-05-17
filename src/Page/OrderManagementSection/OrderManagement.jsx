import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SideBar from "../../Component/SideBar";
import OderManagementTable from "./OrderManagementTable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Table, TableCell, TableRow, TableBody } from "@mui/material";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    product: "",
    user: "",
    shippingCharges: 0,
    discount: 0,
    quantity: 1,
    subtotal: 0,
    total: 0,
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  useEffect(() => {
    const token = cookies.token;
    if (!token) {
      navigate("/loginadmin");
      return;
    }
    fetchData();
  }, [cookies, navigate]);

  const fetchData = async () => {
    try {
      const token = cookies.token;

      const productResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!productResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productData = await productResponse.json();
      if (productData.success && productData.products) {
        setProducts(productData.products);
      }

      const adminResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/users?role=admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!adminResponse.ok) {
        throw new Error("Failed to fetch admins");
      }
      const adminData = await adminResponse.json();
      if (adminData.success && adminData.users) {
        setAdmins(adminData.users);
      }

      const orderResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!orderResponse.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orderData = await orderResponse.json();
      if (orderData.success && orderData.orders) {
        setOrders(orderData.orders);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadExcel = () => {
    // Function for downloading excel
  };

  const countOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const handleCreateOrder = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      product: "",
      user: "",
      shippingCharges: 0,
      discount: 0,
      quantity: 1,
      subtotal: 0,
      total: 0,
    });
    setSelectedProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
    if (name === "quantity") {
      // Update quantity and recalculate subtotal and total
      updatedFormData = {
        ...updatedFormData,
        quantity: value,
        subtotal: selectedProduct ? selectedProduct.price * value : 0,
      };
      // Calculate total
      const total =
        updatedFormData.subtotal +
        Number(updatedFormData.shippingCharges) -
        Number(updatedFormData.discount);
      updatedFormData = { ...updatedFormData, total };
    } else if (name === "shippingCharges" || name === "discount") {
      // Update shipping charges or discount and recalculate total
      const total =
        formData.subtotal +
        Number(updatedFormData.shippingCharges) -
        Number(updatedFormData.discount);
      updatedFormData = { ...updatedFormData, total };
    }
    setFormData(updatedFormData);
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    setSelectedProduct(selectedProduct);
    // Update subtotal and total when product changes
    const subtotal = selectedProduct
      ? selectedProduct.price * formData.quantity
      : 0;
    const total =
      subtotal + Number(formData.shippingCharges) - Number(formData.discount);
    setFormData({ ...formData, subtotal, total });
  };

  const handleAdminChange = (e) => {
    setSelectedAdmin(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = cookies.token;
      const payload = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
        product: selectedProduct._id, // Send the product ID
        quantity: formData.quantity,
        shippingCharges: formData.shippingCharges,
        discount: formData.discount,
        subtotal: formData.subtotal,
        total: formData.total,
        user: selectedAdmin, // Send the selected user ID
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/order/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      toast.success("Order created successfully");
      handleClose();
      fetchData(); // Refresh order data
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  const calculateSubtotalAndTotal = (
    product,
    quantity,
    shippingCharges,
    discount
  ) => {
    if (product) {
      const subtotal = product.price * quantity;
      const total = subtotal + shippingCharges - discount;
      setFormData({ ...formData, subtotal, total });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ marginTop: "1rem" }}>
          <Button
            onClick={handleDownloadExcel}
            sx={{ background: "orange" }}
            variant="contained"
          >
            Order Summary
          </Button>
          <Button
            onClick={handleCreateOrder}
            sx={{ background: "orange", ml: 2 }}
            variant="contained"
          >
            Create Order
          </Button>
        </Box>

        <OderManagementTable />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogContent>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="state"
              label="State"
              value={formData.state}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="pinCode"
              label="Pin Code"
              value={formData.pinCode}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Select Product"
              name="product"
              value={formData.product}
              onChange={handleProductChange}
              fullWidth
              margin="normal"
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedProduct && (
              <Box>
                <Typography variant="h6">
                  Selected Product Information
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>
                        <img
                          style={{
                            width: "350px",
                            height: "200px",
                            objectFit: "contain",
                          }}
                          src={selectedProduct.productImages[0]}
                          alt="Product"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{selectedProduct.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Price</TableCell>
                      <TableCell>₹{selectedProduct.price}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MRP</TableCell>
                      <TableCell>₹{selectedProduct.mrp}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Verified</TableCell>
                      <TableCell
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {selectedProduct.isVerified === "true" ? (
                          <>
                            <p style={{ marginRight: "5px", color: "green" }}>
                              YES
                            </p>
                            <CheckCircleIcon style={{ color: "green" }} />
                          </>
                        ) : (
                          <>
                            <p style={{ marginRight: "5px", color: "red" }}>
                              NO
                            </p>
                            <CancelIcon style={{ color: "red" }} />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}

            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="shippingCharges"
              label="Shipping Charges"
              type="number"
              value={formData.shippingCharges}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="discount"
              label="Discount"
              type="number"
              value={formData.discount}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Typography>Subtotal: ₹{formData.subtotal}</Typography>
            <Typography>Total: ₹{formData.total}</Typography>
            <TextField
              select
              label="Select Admin"
              name="user"
              value={selectedAdmin}
              onChange={handleAdminChange}
              fullWidth
              margin="normal"
            >
              {admins
                .filter((admin) => admin.role === "admin")
                .map((admin) => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.name}
                  </MenuItem>
                ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer />
    </Box>
  );
}
