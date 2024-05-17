import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

const CategorySubcategoryDialog = ({ open, handleClose, data }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Category & Subcategory Schema</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(data).map(([category, subcategories]) => (
            <React.Fragment key={category}>
              <ListItemText primary={category} />
              <List>
                {subcategories.map((subcategory) => (
                  <ListItemText key={subcategory} secondary={subcategory} />
                ))}
              </List>
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySubcategoryDialog;
