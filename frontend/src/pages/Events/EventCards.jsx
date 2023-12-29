import React from 'react'
import { events } from '../../assets/data'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import styles from './EventCard.module.css'

const Events = () => {
  return (
    <>
        <section className={styles['content']}>
            <div className={styles["grid2"]}>
                {events.map((item)=> (
                <div className={styles['boxItems']} key={item.id}> 
                        <div className={styles['img']}>
                            <img src={item.cover} alt='' />
                        </div>
                    <div className={styles["details"]}>
                        <div className={styles['date']}>
                                <h4>{item.date}</h4>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.desc.slice(0,250)}...</p>
                        <div className={styles["contentUserInfoContainer"]}>
                            <div className={styles['userProfileImg']}>
                                <img src={item.userProfile} alt='' />
                            </div>
                            <p>{item.user}</p>
                        </div>
                    </div>
                    <div className={styles["eventLinkContainer"]}>
                            <a className={styles['eventLink']} href="#">Read Event
                                <ArrowForwardRoundedIcon/>
                            </a>
                        </div>
                    </div>

                ))}

            </div>
        </section>
    </>
  ) 
}

export default Events;