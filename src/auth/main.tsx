import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthPage } from './AuthPage'
import './auth.css'

createRoot(document.getElementById('auth-root')!).render(<StrictMode><AuthPage /></StrictMode>)
