import React from 'react'
import { events } from '../../assets/events'
import profileImage from '../../siliDeli.svg'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import styles from './eventCards.module.css'

const EventCards = () => {
  return (
    <>
        <section className={styles['eventContent']}>
            <div className={styles["grid"]}>
                {events.map((item)=> (
                <div className={styles['eventContentItems' ]}key={item.id}>
                    <div className={styles['img']}>
                        <img src={item.cover} alt='' />
                    </div>
                        
                    <div className={styles["eventDetails"]}>
                        <h4 className={styles['eventdate']}>{item.date}</h4>
                        <h3>{item.title}</h3>
                    
                            <div className={styles["footerContainer"]}>
                                <div className={styles["eventUserProfileContainer"]}>
                                    <div className={styles["eventPostUserProfile"]}>
                                        <img src={profileImage} alt="User Profile" className={styles["profileImage"]}/>
                                        <h2 className={styles["eventPostUsername"]}>SILI DELI</h2>
                                    </div>
                                    <a className={styles["eventLink"]} href="#">Read Event
                                    <ArrowForwardRoundedIcon/>
                                    </a>
                                </div>
                            </div>
                    </div>
                </div>
                ))} 
            </div>
        </section>
    </>
  ) 
}

export default EventCards;