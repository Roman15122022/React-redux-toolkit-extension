import React from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import Home from './components/Home/Home'
import About from './components/About/About'

function Tabs() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </div>
  )
}

export default Tabs
