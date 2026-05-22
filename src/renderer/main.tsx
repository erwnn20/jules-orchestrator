import { ThemeProvider } from "@context/ThemeContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from "react-router";
import App from "./App";

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    }
  }
})

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HashRouter>
          <App/>
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)