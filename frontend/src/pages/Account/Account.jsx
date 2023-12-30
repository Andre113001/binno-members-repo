import React from 'react'

// Components
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header';
import { useAuth } from '../../hooks/AuthContext';

const Account = () => {
  const { memberId } = useAuth();
  console.log(memberId);

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
