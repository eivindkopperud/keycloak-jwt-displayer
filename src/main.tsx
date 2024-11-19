import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      {/* Redirect the root URL to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<App />} />
    </Routes>
  </BrowserRouter>
</StrictMode>
)
