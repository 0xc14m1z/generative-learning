import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Default to dark mode
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(<App />)
