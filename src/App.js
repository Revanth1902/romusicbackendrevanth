import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import OrderManagement from "./Page/OrderManagementSection/OrderManagement";
import ProductManagement from "./Page/Product Management/ProductManagement";
import PaymentsManagementnewproduct from "./Page/Product Management/AddProduct";

import InventoryManagement from "./Page/InventoryMangement/InventoryManagement";

import AgentManagement from "./Page/AgentManagementSection/AgentManagement";
import UserManagement from "./Page/UserManagement/UserManagement";

import Login from "./Page/Login/loginadmin";

import BannerComponent from "./Page/InventoryMangement/addbaneer";
import Coupons from "./Page/Coupon Management/couponcode";
import EditProduct from "./Page/Product Management/editproduct";
import BrandsManagement from "./Page/InventoryMangement/brandmanagement";
import CategoryComponent from "./Page/InventoryMangement/CategoryMangement";
import StaffManagement from "./Page/StaffManagement/Staffmanagement";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/ordermanagement" element={<OrderManagement />}></Route>
          <Route
            path="/productmanagement"
            element={<ProductManagement />}
          ></Route>

          <Route path="/usermanagement" element={<UserManagement />}></Route>

          <Route path="/agentmanagement" element={<AgentManagement />}></Route>
          <Route path="/brandmanagement" element={<BrandsManagement />}></Route>
          <Route path="/couponcodes" element={<Coupons />}></Route>
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route
            path="/categorymanagement"
            element={<CategoryComponent />}
          ></Route>
          <Route
            path="/addproduct"
            element={<PaymentsManagementnewproduct />}
          ></Route>
          <Route path="/addbanner" element={<BannerComponent />}></Route>
          <Route path="/loginadmin" element={<Login />}></Route>
          <Route
            path="/inventorymanagement"
            element={<InventoryManagement />}
          ></Route>
           <Route
            path="/staffmanagement"
            element={<StaffManagement />}
          ></Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}
