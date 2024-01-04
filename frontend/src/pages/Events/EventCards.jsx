import React, { useState, useEffect } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import styles from './EventCard.module.css'
import useLoadProfile from '../../hooks/useLoadProfile';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { profileData } = useLoadProfile();

    useEffect(() => {
        const loadHeadingData = async () => {
            if (profileData) {
                const profile = await profileData;
                const fetchGuides = await fetch(`/api/event/all/${profile.member_id}`);
                fetchGuides.json().then(result => {
                    setEvents(result)
                })
            }
        }

        loadHeadingData();
    }, [profileData])

    console.log(events);

    return (
        <>
            <section className={styles['content']}>
                <div className={styles["grid2"]}>
                    {events.map((event)=> (
                    <div className={styles['boxItems']} key={event.event_id}> 
                            <div className={styles['img']}>
                                <img src='' alt='' />
                            </div>
                        <div className={styles["details"]}>
                            <div className={styles['date']}>
                                <h4>{event.event_date}</h4>
                            </div>
                            <h3>{event.event_title}</h3>
                            <p>{event.event_description.slice(0,250)}...</p>
                            <div className={styles["contentUserInfoContainer"]}>
                                <div className={styles['userProfileImg']}>
                                    <img src='' alt='' />
                                </div>
                                <p>{profileData.setting_institution}</p>
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