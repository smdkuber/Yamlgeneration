import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" />
      {/* <App /> */}
      <RouterProvider router={routes}/>
    </ThemeProvider>
  </React.StrictMode>
);
reportWebVitals();
