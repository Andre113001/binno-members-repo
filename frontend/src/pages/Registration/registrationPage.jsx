import React from 'react'
import '../../App.css'
import { Outlet } from 'react-router-dom'

function RegistrationPage() {

  return (
    <>
       <div className="registrationPage">
          <div className="header">
              <img className='logo' src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/416361391_3570702596514517_5617565925697268186_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeFgjR-dPwsml2jhoekDhRIDqijj7YoftFaqKOPtih-0VuDsEUBBGkZi_Ntjmv2O5u4MtKxwsggzZmqJJkHJnL1i&_nc_ohc=hHT4Nrzm9TAAX8yqsRM&_nc_ht=scontent.fceb2-1.fna&oh=00_AfCTd_XHTOqBdePX_SgRrpt3gtfsqNnaV5mAGUVL8U0KNg&oe=65A1FC51" 
              alt=""/>
          </div>

          <div className="fromRegistraion">
              <Outlet />
          </div>
      </div>
    </>
  )
}

export default RegistrationPage