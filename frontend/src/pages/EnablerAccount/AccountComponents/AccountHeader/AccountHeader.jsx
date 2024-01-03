import React from "react";
import styles from './AccountHeader.module.css'

import { companyInformation } from '../../../../assets/companyInfo'

import profileImage from '../../../../assets/siliDeli.svg';
import Coverphoto from '../../../../assets/Coverphoto.png';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

function AccountHeader() {
    return (
    <>
        <div className={styles["Header"]}>
            <div className={styles["profileCoverImage"]}>
                        <img className={styles["coverPhoto"]} src={Coverphoto} alt="Cover Photo" />
                    </div>
                <div className={styles["UserProfileContainer"]}>
                    <div className={styles["userProfile"]}>
                        <img src={profileImage} alt="User Profile" className={styles["profileImage"]}/>    
                    </div>
                        <div className={styles["UserInfoContainer"]}>
                                <p>{companyInformation.userType}</p>
                                <h2>{companyInformation.user}</h2>
                            </div>
                </div>
                    <div className={styles["HeaderButtons"]}>
                        <button className={styles["profileEditButton"]}>
                            <EditRoundedIcon/> Edit Profile</button>

                        <button className={styles["ViewPageButton"]}>
                            <VisibilityRoundedIcon/> View Page</button>

                        <div className={styles["SettingsButton"]}>
                            <SettingsRoundedIcon />
                        </div>
                        
                        
                        <div className={styles["NotificationBell"]}>
                            <NotificationsRoundedIcon />
                        </div>
                    </div>
                        
            </div>
    </>
    );
}

export default AccountHeader; 