import React from 'react'

// Components
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header';

const Account = () => {
  return (
    <div className='App'>
        <SideBar />
        <div className='layoutContainer'>
            <div className="Headline">
              <Header />
            </div>
          </div>        
    </div>
  )
}

export default Account
