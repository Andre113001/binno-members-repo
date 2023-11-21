import { useEffect, useState } from 'react'
import {Routes, Route} from "react-router-dom";

// Pages
import Home from './pages/Home';
import Members from './pages/Members';
import Login from './pages/Login'
import Facebook from './pages/Facebook';

function App() {

  return (
    <>
      <div className='w-screen h-screen'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/facebook' element={<Facebook />} />
          <Route path="/home" element={<Home />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </div>
    </>
  )
}

export default App
