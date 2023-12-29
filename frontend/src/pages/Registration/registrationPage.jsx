import React from 'react'
import icon from '../../assets/binno.svg'
import '../../App.css'
import { Outlet } from 'react-router-dom'

function RegistrationPage() {

  return (
    <>
       <div className="registrationPage">
          <div className="header">
              <img className='logo' src={ icon } alt=""/>
          </div>

          <div className="fromRegistraion">
              <Outlet />
          </div>
      </div>
    </>
  )
}

export default RegistrationPage