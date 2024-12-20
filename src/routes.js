import { createBrowserRouter } from "react-router-dom";
import Chat from "./pages/Chat";
import App from "./App";
import Home from "./pages/Home";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);
