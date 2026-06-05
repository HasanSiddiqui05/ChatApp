import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ContactContextProvider } from './context/ContactContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketContextProvider>
        <ContactContextProvider>
          <App />
        </ContactContextProvider>
      </SocketContextProvider>
    </AuthProvider>
  </StrictMode>,
)
