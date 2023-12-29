import React from 'react'
import './SideBar.css'
import { SideBarData } from './SideBarData'
import logo from '../../icon.svg'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link, useNavigate } from 'react-router-dom';



function SideBar() {
    
    const navigate = useNavigate();

    function handleDestroyToken() {
        localStorage.removeItem('access');
        console.log('Token Destroyed');
        navigate('/')
    }

    return <div className='SideBar'>
    <div className="sideBarContent">
        <img src={logo} alt="BiNNO" className='logo'/>
        {/* insert type of user */}
        <ul className='SideBarList'>
            {SideBarData.map((val, key)=>{
                return (
                <>
                <Link to={val.link} activeClassName="activeLink" style={{ textDecoration: 'none', color: '#3e3e3e' }}>
                    <li key={key} 
                    className='row p-3'
                    id={window.location.pathname == val.link ? "active" : " "}
                        onClick={()=> {
                        window.location.pathname = val.link;
                    }}
                    >
                    <div id='icon'>{val.icon}</div>
                    <div id='title'>{val.title}</div>
                    </li>
                </Link>
                </>   
                );   
            })}
        </ul>
    </div>
    <div className="logout" onClick={handleDestroyToken}>
        <LogoutRoundedIcon />
        <p>Logout</p>
    </div>
    </div>;
}

export default SideBar