import React from 'react'
import { companyInformation } from '../../../../assets/companyInfo'
import styles from './informationTab.module.css'

import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

function InformationTab(props) {
  return (
    <>
        <div className={styles["AboutTabContainer"]}> {/* {styles["companyContact"]} */}
            <h1>About</h1>
            <hr />
            <div className={styles["companyContent"]}>
               <p className={styles["companyDescription"]}>{props.description}</p>
               <p className={styles["companyLocation"]}><FmdGoodRoundedIcon /> {props.address}</p>
               <div className={styles["companyContact"]} >
                    <p><EmailRoundedIcon />{props.email}</p>
                    <p><CallRoundedIcon />{props.phone}</p>
                    <p><FacebookRoundedIcon/>@{props.fb}</p>
               </div>
            </div>
        </div>
    </>
  )
}

export default InformationTab