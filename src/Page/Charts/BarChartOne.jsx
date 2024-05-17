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

const BarChartOne = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [time, setTime] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token"); // Assuming cookies is imported and set up properly
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/order/getOrderByStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add other headers if needed
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

      const barColors = [
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
        "rgb(0, 101, 193)",
      ];

      chartInstance.current = new Chart(myChartRef, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Data",
              data: data.count,
              backgroundColor: barColors,
              barPercentage: 0.2,
              borderRadius: 10,
            },
          ],
        },
      });
    }
  }, [data]);

  return (
    <>
      <div className="BarChartOne01">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            Total Orders
            <br />
            <Typography paragraph style={{ fontWeight: "800" }}>
             
              {data && data.count}
              <span
                style={{ color: "green", fontSize: "12px", fontWeight: "200" }}
              >
                <ArrowUpwardIcon sx={{ fontSize: "12px" }} />
                {data && data.count}%
              </span>
            </Typography>
          </Typography>
          {/* <FormControl
            sx={{
              m: 1,
              minWidth: 120,
              alignSelf: "flex-start",
            }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Today</InputLabel>
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
          </FormControl> */}
        </Box>
        <canvas ref={chartRef} />
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "15px" }}>
            Categories
            <br />
            <Typography paragraph style={{ fontWeight: "800" }}>
              {data && data.categoriesCount}
              <span
                style={{ color: "green", fontSize: "12px", fontWeight: "200" }}
              >
                <ArrowUpwardIcon sx={{ fontSize: "12px" }} />
                {data && data.categoriesIncreasePercentage}%
              </span>
            </Typography>
          </Typography>

          <Typography variant="h6" sx={{ fontSize: "15px" }}>
            Sub Categories
            <br />
            <Typography paragraph style={{ fontWeight: "800" }}>
              {data && data.subCategoriesCount}
              <span
                style={{
                  color: "green",
                  fontSize: "12px",
                  fontWeight: "200",
                }}
              >
                <ArrowUpwardIcon sx={{ fontSize: "12px" }} />
                {data && data.subCategoriesIncreasePercentage}%
              </span>
            </Typography>
          </Typography>
        </Box> */}
      </div>
    </>
  );
};

export default BarChartOne;
