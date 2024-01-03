import React from 'react'
import { events } from '../../../../assets/EnablerAccountData'
import styles from './EventCard.module.css'

const Events = () => {
  return (
    <>
        <section className={styles['EventPage']}>
            <div className={styles["titleContainer"]}>
                <h1>Current & Upcoming Events</h1>
                <a href="/events">View all Events...</a>
            </div>
            <hr />
            <div className={styles["content"]}>
                {events.map((item)=> (
                <div className={styles['boxItems']} key={item.id}> 
                    <div className={styles["details"]}>
                        <div className={styles["eventDateContainer"]}>
                            <div className={styles["TitleContainer"]}>
                                <a href=""><h3>{item.title}</h3>
                                </a>
                            </div>
                            <div className={styles['date']}>
                                    <h4>{item.date}</h4>
                            </div>
                        </div>
                        <p>{item.desc.slice(0,250)}...</p>
                    </div>
                    </div>

                ))}

            </div>
        </section>
    </>
  ) 
}

export default Events;