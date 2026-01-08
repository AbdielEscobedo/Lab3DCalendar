import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import { AuthProvider } from './context/AuthContext'
import axios from 'axios'
import ErrorBoundary from './components/ErrorBoundary'

// Configurar URL del Backend
// En desarrollo (local) usa el proxy de Vite.
// En producción (GitHub Pages) usará la variable de entorno o una URL fija que pondremos luego.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
