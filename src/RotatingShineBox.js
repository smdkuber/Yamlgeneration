import React from "react";
import { Box, keyframes } from "@mui/material";

// Define the shine animation for the border
const borderShineAnimation = keyframes`
  0% {
    background-position: 200% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
`;

function RotatingBorderShineBox({ children }) {
  return (
    <Box
      sx={{
        position: "relative", // Needed for the pseudo-element
        borderRadius: "12px", // Rounded corners
        display: "flex", // Center the content
        justifyContent: "center",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "98.3%",
          height: "91%",
          borderRadius: "12px", // Match the box's border radius
          padding: "4px", // Border thickness
          background: `linear-gradient(
            120deg,
            #8afdfe,
            rgba(255, 255, 255, 0.1),
            #8afdfe
          )`,
          backgroundSize: "200% 200%",
          animation: `${borderShineAnimation} 3s linear infinite`, // Animation applied here
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", // Mask to show only the border
          WebkitMaskComposite: "destination-out", // Makes inner box transparent
          maskComposite: "exclude", // Ensures the shine only appears on the border
          zIndex: 1, // Keep it behind the content
        },
        zIndex: 0, // Box content on top
      }}
    >
      {children}
    </Box>
  );
}

export default RotatingBorderShineBox;
