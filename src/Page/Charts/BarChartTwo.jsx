import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const BarChartTwo = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [time, setTime] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  useEffect(() => {
    if (data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const myChartRef = chartRef.current.getContext("2d");

      const filteredUsers = filterUsersByTime(data.users, time);
      const roleLabels = ["Admin", "User"]; // Hardcoded role labels for the example
      const roleCounts = [
        filteredUsers.filter((user) => user.role === "admin").length,
        filteredUsers.filter((user) => user.role === "user").length,
      ]; // Count of admin and user roles

      chartInstance.current = new Chart(myChartRef, {
        type: "bar",
        data: {
          labels: roleLabels,
          datasets: [
            {
              label: "User Roles",
              data: roleCounts,
              backgroundColor: "rgb(0, 101, 193)",
              barPercentage: 0.2,
              borderRadius: 10,
            },
          ],
        },
      });
    }
  }, [data, time]);

  const filterUsersByTime = (users, selectedTime) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentWeek = getWeekNumber(currentDate);
    const currentDay = currentDate.getDate();

    return users.filter((user) => {
      const userDate = new Date(user.createdAt);
      const userYear = userDate.getFullYear();
      const userMonth = userDate.getMonth();
      const userWeek = getWeekNumber(userDate);
      const userDay = userDate.getDate();

      switch (selectedTime) {
        case "this_year":
          return userYear === currentYear;
        case "this_month":
          return userYear === currentYear && userMonth === currentMonth;
        case "this_week":
          return userYear === currentYear && userWeek === currentWeek;
        case "today":
          return (
            userYear === currentYear &&
            userMonth === currentMonth &&
            userDay === currentDay
          );
        default:
          return true;
      }
    });
  };

  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const weekNumber = Math.floor(diff / oneDay / 7);
    return weekNumber;
  };

  return (
    <>
      <div className="BarChartTwo01">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            Total Users
            <br />
            <Typography paragraph style={{ fontWeight: "800" }}>
              {data && data.users.length}
              <span
                style={{ color: "green", fontSize: "12px", fontWeight: "200" }}
              >
                <ArrowUpwardIcon sx={{ fontSize: "12px" }} />
                {/* You can calculate the percentage change here if needed */}
              </span>
            </Typography>
          </Typography>
          <FormControl
            sx={{
              m: 1,
              minWidth: 120,
              alignSelf: "flex-start",
            }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Time</InputLabel>
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
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="this_week">This Week</MenuItem>
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="this_year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {data && data.users.length > 0 ? (
          <canvas ref={chartRef} />
        ) : (
          <Typography variant="body1">No users in this period.</Typography>
        )}
      </div>
    </>
  );
};

export default BarChartTwo;
