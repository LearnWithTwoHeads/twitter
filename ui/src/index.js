import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./providers/AuthProvider";
import { BrowserRouter } from "react-router-dom";

// For toast notifications throughout the front end application.
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
