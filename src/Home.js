import { Box, Button, Typography } from "@mui/material";
import React from "react";
import BG from "../images/BG.svg";
import Logo from "../Logo";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  const headerItems = [
    { name: "Home", path: "/home" },
    { name: "Chat", path: "/chat" },
    {
      name: "Contact Us",
      path: "/contact-us",
      link: "https://www.visionet.com/contact-us",
    },
    {
      name: "About Us",
      path: "/about-us",
      link: "https://www.visionet.com/about-us",
    },
    {
      name: "Insights",
      path: "/insights",
      link: "https://www.visionet.com/insights",
    },
  ];

  const navigationHandler = (path, link) => {
    console.log("clicked");

    if ((path === "/home" || "/chat") && !link) {
      navigate(path);
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "right bottom",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "12%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Box
          sx={{
            width: "98%",
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "20%" }}>
            <Logo />
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "35%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
                color: "white",
              }}
            >
              {" "}
              {headerItems.map(({ name, path, link }) => (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigationHandler(path, link);
                  }}
                >
                  <Typography>{name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              width: "30%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ margin: "0 15% 0 auto" }}>
              <Button variant="contained"> Let's talk</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "56%",
          height: "88%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "85%",
            height: "50%",
            display: "flex",
            flexDirection: "column",
            gap: "12%",
            color: "white",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "1%",
            }}
          >
            <Typography variant="h5">Welcome to</Typography>
            <Typography variant="gradientText">AI Konnect</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <Typography color="rgba(255,255,255,0.85)">
              An application integrating multiple AI APIs to dynamically
              generate Kong deck YAML files based on user chat, enabling
              seamless configuration of services and routes tailored to specific
              requirements through chat-driven interactions.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {" "}
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              variant="contained"
              onClick={() => {
                navigate("/chat");
              }}
            >
              Try out{" "}
              <CallMadeOutlinedIcon
                sx={{ fontSize: "1.2rem", margin: "0 0 2px 0" }}
              />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
