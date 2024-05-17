import ViewInArIcon from "@mui/icons-material/ViewInAr";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const CardChartSix = () => {
  const [time, setTime] = useState("");
  const [data, setData] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/order/getOrderByStatus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      setData(jsonData);

      // Calculate counts
      if (jsonData && Array.isArray(jsonData.data)) {
        const orders = jsonData.data;
        setPendingCount(orders.filter((order) => order.status === "Processing").length);
        setCancelledCount(orders.filter((order) => order.status === "Cancelled").length);
        setConfirmedCount(orders.filter((order) => order.status === "Shipped").length);
        setDeliveredCount(orders.filter((order) => order.status === "Delivered").length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="PieChartOne01">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <ViewInArIcon style={{ marginBottom: "-4", color: "orange" }} />
            Order Status
          </Typography>

          <FormControl
            sx={{ m: 1, minWidth: 120, alignSelf: "flex-start" }}
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
          </FormControl>
        </Box>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "45%",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "space-evenly",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", fontSize: "15px" }}>
              {data && data.data.length}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
              }}
            >
              All
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "45%",
              marginTop: "10px",
              marginBottom: "10px",
              paddingTop: "10px",
              paddingBottom: "10px",
              justifyContent: "space-evenly",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", fontSize: "15px" }}>
              {pendingCount}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
              }}
            >
              Pending
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "45%",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "space-evenly",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", fontSize: "15px" }}>
              {confirmedCount}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
              }}
            >
              Confirmed
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "45%",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "space-evenly",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", fontSize: "15px" }}>
              {deliveredCount}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
              }}
            >
              Delivered
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "45%",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "space-evenly",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", fontSize: "15px" }}>
              {cancelledCount}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
              }}
            >
              Cancelled
            </Typography>
          </Box>
        </div>
      </div>
    </>
  );
};

export default CardChartSix;
