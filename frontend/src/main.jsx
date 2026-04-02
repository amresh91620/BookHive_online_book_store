import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import App from "./App.jsx";
import store from "./store/index.js";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0, // Don't retry mutations
      onError: (error) => {
        if (import.meta.env.DEV) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                limit: 3,
                style: {
                  background: "rgba(255, 255, 255, 0.92)",
                  color: "#162033",
                  borderRadius: "18px",
                  border: "1px solid rgba(213, 227, 221, 0.92)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.1)",
                },
              }}
            />
          </BrowserRouter>
          {/* DevTools - Uncomment to enable in development */}
          {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

