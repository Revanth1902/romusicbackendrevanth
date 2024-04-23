import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./admin";
import UserDashboard from "./user";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/" element={<UserDashboard />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
