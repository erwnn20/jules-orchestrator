import '@shared/utils/global.utils'
import { ThemeProvider } from "@context/ThemeContext";
import App from "@renderer/App";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import React from 'react'
import ReactDOM from 'react-dom/client'

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
        <App/>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)