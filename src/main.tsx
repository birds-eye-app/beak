import { green } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router";
import { BirdMap } from "./BirdMap";
import { ErrorDisplay } from "./ErrorBoundary.tsx";
import { Chirped } from "./chirped/Chirped";
import { onError } from "./chirped/helpers.ts";
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

// eslint-disable-next-line react-refresh/only-export-components
const NotFound = () => <h1>🐦 Not Found 🐦</h1>;

// eslint-disable-next-line react-refresh/only-export-components
const ErrorCausingPage = () => {
  // eslint-disable-next-line no-constant-condition
  if (1 + 1 === 2) {
    throw new Error("Oh no! Something went wrong.");
  }
  return null;
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<ErrorDisplay />} onError={onError}>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Chirped />} />
            <Route path="/birds_eye" element={<BirdMap />} />
            <Route path="/chirped" element={<Chirped />} />
            <Route path="/error" element={<ErrorCausingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </ErrorBoundary>,
);
