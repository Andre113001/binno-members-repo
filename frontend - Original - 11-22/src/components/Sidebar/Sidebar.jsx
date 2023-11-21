import React from 'react'

// Material UI Icons
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import EventIcon from '@mui/icons-material/Event';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';


function Sidebar() {
  return (
    <>
        <div className='sidebar'>
            <div className='logo m-10 mb-0'>
                {/* LOGO */}
                <div className='mt-3 mb flex items-center overflow-hidden'>
                    <img src="../../../public/binno-logo.png" className='w-full h-20 object-cover' />
                </div>

                {/* User Type */}
                <span className='text-blue-400 text-bold text-xl'>Startup Enabler</span>
            </div>
            <div className='sidebar-items'>
                {/* HOME */}
                <div className='sidebar-item'>
                    <HomeIcon fontSize='large'/>
                    <span className='sidebar-text'>
                        Home
                    </span>
                </div>

                {/* PROGRAMS */}
                <div className='sidebar-item'>
                    <BookIcon fontSize='large' />
                    <span className='sidebar-text'>
                        Programs
                    </span>
                </div>
                
                {/* EVENTS */}
                <div className='sidebar-item'>
                    <EventIcon fontSize='large' />
                    <span className='sidebar-text'>
                        Events
                    </span>
                </div>
                
                {/* BLOG ENTRIES */}
                <div className='sidebar-item'>
                    <ChromeReaderModeIcon fontSize='large' />
                    <span className='sidebar-text'>
                        Blog Entries
                    </span>
                </div>
                
                {/* ACCOUNT */}
                <div className='sidebar-item'>
                    <PersonIcon fontSize='large' />
                    <span className='sidebar-text'>
                        Account
                    </span>
                </div>
            </div>

            {/* LOGOUT */}
            <div className='sidebar-item'>
                <LogoutIcon fontSize='large' />
                <span className='sidebar-text'>
                    Logout
                </span>
            </div>
            

        </div>
    </>
  )
}

export default Sidebar
