import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        gradientText: {
          fontSize: "2.3rem",
          fontWeight: "bold",
          background: "linear-gradient(75deg, #ff2980, #f8feff, #ff2980)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "grey", // Custom background color
            color: "lightgrey", // Custom text color
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#fffffF", // Global text color for all inputs
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Styles for the TextField root
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent", // Background color for the input
            "& input": {
              color: "#FFFFFF", // Text color for the input
            },
            "& fieldset": {
              borderColor: "#FFFFFF", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#FFFFFF", // Hover state border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFFFFF", // Focused state border color
            },
          },
          "& .MuiInputLabel-root": {
            color: "#FFFFFF", // Label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFFFFF", // Focused label color
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputMultiline: {
          padding: "12px", // Adjust padding for multiline input
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popupIndicator: {
          color: "#FFFFFF", // Default dropdown icon color
          "&:hover": {
            color: "#FFAA00", // Hover state color
          },
        },
        clearIndicator: {
          color: "#FFFFFF", // Default clear icon color
          "&:hover": {
            color: "#FF0000", // Hover state color
          },
        },
        root: {
          "& .MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF", // Default border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF", // Hover state border color
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF", // Focused state border color
            },
          },
          "& .MuiInputLabel-root": {
            color: "#FFFFFF", // Default label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFFFFF", // Focused label color
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#FFFFFF",
      dark: "#a4a6a4",
    },
    secondary: {
      main: "#FFFFFF",
      dark: "#FFFFFF",
    },
  },
});
