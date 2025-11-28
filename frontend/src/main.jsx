import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './contexts/Providers';
import App from './App.jsx'
import './styles/global.css'
import './styles/theme.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Providers>
            <App />
        </Providers>
    </BrowserRouter>
)
