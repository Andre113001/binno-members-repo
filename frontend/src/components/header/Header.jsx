import React, { useEffect, useState } from "react";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import profileImage from '../../siliDeli.svg'
import './Header.css'
import useLoadProfile from "../../hooks/useLoadProfile";

function Header() {
    const [headingData, setHeadingData] = useState([]);
    const { profileData } = useLoadProfile();

    useEffect(() => {
        const loadHeadingData = async () => {
            if (profileData) {
                const result = await profileData;
                setHeadingData(result)
            }
        }

        loadHeadingData();
    }, [profileData])

    return (
        <div className="Header">
            <div className="profileImageContainer"> 
                <div className="userProfile">
                    <img src={profileImage} alt="User Profile" className="profileImage"/>    
                </div>
                <div className="UserInfoContainer">
                        <p>{headingData.user_type}</p>
                        <h2>{headingData.setting_institution}</h2>
                    </div>
            </div>

            {/* <div className="NotificationBell">
                <NotificationsRoundedIcon />
            </div> */}
        </div>
    );
}

export default Header; 