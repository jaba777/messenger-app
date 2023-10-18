import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { StyledEngineProvider } from "@mui/material/styles";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <React.StrictMode>
        <StyledEngineProvider>
          <App />
        </StyledEngineProvider>
      </React.StrictMode>
    </AuthProvider>
  </Router>
);
