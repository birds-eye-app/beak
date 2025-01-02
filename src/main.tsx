import { green } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ErrorDisplay } from "./ErrorBoundary.tsx";
import { onError } from "./chirped/helpers.ts";

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
  <ErrorBoundary fallback={<ErrorDisplay />} onError={onError}>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </ErrorBoundary>,
);
