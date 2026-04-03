import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/css/style.css'
import './assets/css/subpage.css'
import './assets/css/signin.css'
import './assets/css/details.css'
import './assets/css/chatbox.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/madhurbazar">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
