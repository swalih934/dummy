import { useState,useContext } from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Agenda from './pages/Agenda'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { ThemeContext } from './context/ThemeProvider'
import { Link, useLocation } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  const location=useLocation()
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  console.log(location.pathname);

  return (
    <>

<nav className="p-3 d-flex justify-content-between align-items-center ">
  <div className="fw-bold"></div>

  <button
    onClick={toggleDarkMode}
    className={`btn btn-sm btn-outline-primary ms-auto ${location.pathname === '/' ? 'd-none' : ''}`}
    >
    {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
  </button>
</nav>
    <Routes>
      <Route path='/' element={<Auth/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/agenda' element={<Agenda/>}/>

    </Routes>
    <ToastContainer/>

     
    </>
  )
}

export default App
