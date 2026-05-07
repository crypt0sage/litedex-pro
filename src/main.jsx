import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { WalletProvider } from './context/WalletContext.jsx'
import { LiteModeProvider } from './context/LiteModeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <LiteModeProvider>
          <App />
        </LiteModeProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
)
