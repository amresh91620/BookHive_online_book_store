import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster
import App from './App.jsx'
import "./App.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Toaster ko yahan rakhein */}
    <Toaster 
      position="right" 
      reverseOrder={false} 
      toastOptions={{
        // Global styling jo aapke BookHive theme se match karegi
        style: {
          borderRadius: '16px',
          background: '#1e293b', // slate-800
          color: '#fff',
          fontSize: '14px',
          padding: '12px 20px',
        },
        success: {
          iconTheme: {
            primary: '#3b82f6', // blue-500
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </StrictMode>,
)