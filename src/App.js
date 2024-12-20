import { Box } from "@mui/material";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const App = () => {
  const [showFooter, setShowFooter] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Check if user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box sx={{ position: "relative", zIndex: "1" }}>
      {/* <Chat /> */}
      <Outlet />
      {showFooter && (
        <Box
          sx={{
            color: "lightgray",
            position: "fixed",
            bottom: "0.5rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box> © 2024 Visionet Systems. All rights reserved.</Box>
        </Box>
      )}
    </Box>
  );
};

export default App;
