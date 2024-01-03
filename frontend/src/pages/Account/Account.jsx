import React from 'react'

// Components
import SideBar from '../../components/Sidebar/Sidebar';
import Header from '../../components/header/Header';
import { useAuth } from '../../hooks/AuthContext';
import useAccessToken from '../../hooks/useAccessToken';

const Account = () => {
  const isAccessToken = useAccessToken();
  console.log(isAccessToken);

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
