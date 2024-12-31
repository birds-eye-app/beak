import { green } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
      light: green[300],
      dark: green[700],
    },
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary
    fallback={
      <h1>
        🚨🔥 Something went wrong. We have our wisest owls and our fastest
        peregrines looking into it... 🦉🔧🔨
      </h1>
    }
  >
    <StrictMode>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </ErrorBoundary>,
);
