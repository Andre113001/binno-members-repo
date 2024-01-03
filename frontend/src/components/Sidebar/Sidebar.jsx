import React, {useState, useEffect} from 'react'
import './SideBar.css'
import  SideBarData_Enabler  from './SideBarData_Enabler';
import SideBarData_Company from './SideBarData_Company';
import logo from '../../icon.svg'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link, useNavigate } from 'react-router-dom';
import useLoadProfile from "../../hooks/useLoadProfile";


function SideBar() {
    const [data, setData] = useState([]);
    const { profileData } = useLoadProfile();

    const enablerSelections = () => {
        return SideBarData_Enabler.map((val, key)=>{
            return (
            <div key={key}>
                <Link to={val.link} style={{ textDecoration: 'none', color: '#3e3e3e' }}>
                    <li
                        className='row p-3'
                    >
                    <div id='icon'>{val.icon}</div>
                    <div id='title'>{val.title}</div>
                    </li>
                </Link>
            </div>
            );   
        });
    };

    const companySelections = () => {
        return SideBarData_Company.map((val, key)=>{
            return (
            <div key={key}>
                <Link to={val.link} style={{ textDecoration: 'none', color: '#3e3e3e' }}>
                    <li
                        className='row p-3'
                    >
                    <div id='icon'>{val.icon}</div>
                    <div id='title'>{val.title}</div>
                    </li>
                </Link>
            </div>
            );   
        });
    };    

    useEffect(() => {
        const loadHeadingData = async () => {
            if (profileData) {
                const result = await profileData;
                setData(result)
            }
        }

        loadHeadingData();
    }, [profileData])
    
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
            {data.user_type === "Startup Company" ? companySelections() : enablerSelections()}
        </ul>
    </div>
    <div className="logout" onClick={handleDestroyToken}>
        <LogoutRoundedIcon />
        <p>Logout</p>
    </div>
    </div>;
}

export default SideBar