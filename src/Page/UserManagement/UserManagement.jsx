import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver"; // Import saveAs from file-saver
import * as XLSX from "xlsx"; // Import XLSX from xlsx
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import UserManagementDetailsTable from "./UserManagementDetailsTable";
import { useCookies } from "react-cookie";

export default function UserManagement() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [userData, setUserData] = useState([]);
  const [time, setTime] = useState("");
  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    const token = cookies.token;

    if (!token) {
      navigate("/loginadmin");
    } else {
      setTokenAvailable(true);
      fetchUserData();
    }
  }, [cookies, navigate]);

  const fetchUserData = async () => {
    try {
      const token = cookies.token;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: "users",
          },
        }
      );
      if (response.data.success) {
        setUserData(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const exportToExcel = () => {
    // Filter user data for users with role = "user" and select required fields
    const filteredUserData = userData
      .filter((user) => user.role === "user")
      .map((user) => ({
        Name: user.name
          ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
          : "Not mentioned",
        Email: user.email || "Not mentioned",
        MobileNo: user.mobileNo || "Not mentioned",
        IsFirstTime: user.isFirstTimeLogin,
        CustomerSince: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Not mentioned",
      }));

    // Convert filtered data to Excel format and download
    const ws = XLSX.utils.json_to_sheet(filteredUserData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "users.xlsx");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ marginTop: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={exportToExcel}
              sx={{ background: "orange" }}
            >
              Export Users
            </Button>
          </Box>
          <Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "25px",
                  marginBottom: "20px",
                }}
              >
                <div
                  className="ProductManagementProductDetailsSecond00"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4rem",
                    }}
                  >
                    <PeopleOutlineIcon
                      sx={{
                        color: "black",
                        background: "#ffffcc",
                        p: 1,
                        fontSize: "40px",
                        borderRadius: "10px",
                      }}
                    />
                    <FormControl
                      sx={{ minWidth: 100, alignSelf: "flex-start" }}
                      size="small"
                    >
                      <InputLabel id="demo-select-small-label">
                        Today
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={time}
                        label="Time"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={7}>Weekly</MenuItem>
                        <MenuItem value={30}>Monthly</MenuItem>
                        <MenuItem value={365}>Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      All Customers
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        1,250
                        <span
                          style={{
                            fontSize: "12px",
                            color: "green",
                            marginLeft: "4px",
                          }}
                        >
                          +15.80%
                        </span>
                      </Typography>
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      Active
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        1,180
                        <span
                          style={{
                            fontSize: "12px",
                            color: "green",
                            marginLeft: "4px",
                          }}
                        >
                          +85%
                        </span>
                      </Typography>
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      In-Active
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        70
                        <span
                          style={{
                            fontSize: "12px",
                            color: "red",
                            marginLeft: "4px",
                          }}
                        >
                          -10%
                        </span>
                      </Typography>
                    </Typography>
                  </Box>
                </div>

                <div
                  className="ProductManagementProductDetailsSecond00"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4rem",
                    }}
                  >
                    <ShoppingBagIcon
                      sx={{
                        color: "black",
                        background: "#ffffcc",
                        p: 1,
                        fontSize: "40px",
                        borderRadius: "10px",
                      }}
                    />
                    <FormControl
                      sx={{ minWidth: 100, alignSelf: "flex-start" }}
                      size="small"
                    >
                      <InputLabel id="demo-select-small-label">
                        Today
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={time}
                        label="Time"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={7}>Weekly</MenuItem>
                        <MenuItem value={30}>Monthly</MenuItem>
                        <MenuItem value={365}>Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      All Customers
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        30
                        <span
                          style={{
                            fontSize: "12px",
                            color: "red",
                            marginLeft: "4px",
                          }}
                        >
                          -20%
                        </span>
                      </Typography>
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      Active
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        657
                      </Typography>
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", color: "grey" }}
                    >
                      Abandoned Carts
                      <br />
                      <Typography
                        paragraph
                        style={{ fontWeight: "500", color: "black" }}
                      >
                        5
                      </Typography>
                    </Typography>
                  </Box>
                </div>
              </Box>
              <Box>
                <UserManagementDetailsTable />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
