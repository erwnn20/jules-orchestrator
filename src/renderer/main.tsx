import { AppProvider } from "@context/AppContext";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from "react-router";
import App from "./App";

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App/>
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
)