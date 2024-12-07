import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import Router from './Router/Router';
import { ThemeProvider } from './contexts/theme-provider';
import { Toaster } from './components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
    <Toaster />
  </StrictMode>,
)
