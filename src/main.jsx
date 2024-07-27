import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faCheckSquare, faCoffee, faTrash, faCheck)

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <App />
)
