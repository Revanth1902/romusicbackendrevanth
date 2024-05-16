import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";

const StockCheckPopup = ({ open, handleClose, products }) => {
  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle case when the input is undefined or null
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Low Stock Products</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell
                  
                  >
                    <p style={{ backgroundColor: "rgba(255, 0, 0, 0.5)", textAlign:"center" , borderRadius:"10px" }} >{product.stock}</p>
                  </TableCell>

                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(product.category)}
                  </TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(product.subCategory)}
                  </TableCell>
                  <TableCell>{capitalizeFirstLetter(product.brand)}</TableCell>

                  <TableCell>
                    {product.isVerified ? "Verified" : "Not Verified"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockCheckPopup;
