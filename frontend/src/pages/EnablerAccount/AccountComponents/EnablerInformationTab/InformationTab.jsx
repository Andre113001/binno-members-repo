import React from 'react'
import { companyInformation } from '../../../../assets/companyInfo'
import styles from './informationTab.module.css'

import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

function InformationTab() {
  return (
    <>
        <div className={styles["AboutTabContainer"]}> {/* {styles["companyContact"]} */}
            <h1>About</h1>
            <hr />
            <div className={styles["companyContent"]}>
               <p className={styles["companyDescription"]}>{companyInformation.companyDescription}</p>
               <p className={styles["companyLocation"]}><FmdGoodRoundedIcon /> {companyInformation.companyLocation}</p>
               <div className={styles["companyContact"]} >
                    <p><EmailRoundedIcon />{companyInformation.email}</p>
                    <p><CallRoundedIcon />{companyInformation.contactNumber}</p>
                    <p><FacebookRoundedIcon/>{companyInformation.facebookPage}</p>
               </div>
            </div>
        </div>
    </>
  )
}

export default InformationTab