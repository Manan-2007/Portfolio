import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// No StrictMode: its dev double-render breaks AnimatePresence exit animations
// on framer-motion 12 + React 19, which strands the preloader mid-curtain.
createRoot(document.getElementById('root')).render(<App />)
