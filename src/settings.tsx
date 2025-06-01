import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import SettingsPage from "./SettingsPage";

ReactDOM.createRoot(
  document.getElementById("settings-root") as HTMLElement
).render(
  <React.StrictMode>
    <SettingsPage />
  </React.StrictMode>
);
