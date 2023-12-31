import React, { useState, useEffect } from 'react'
import { guide } from '../../assets/guide'
import styles from './GuidesCards.module.css'
import useLoadProfile from '../../hooks/useLoadProfile.jsx';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';


const GuideCards = () => {
    const [guides, setGuides] = useState([]);
    const { profileData } = useLoadProfile();

    useEffect(() => {
        const loadHeadingData = async () => {
            if (profileData) {
                const profile = await profileData;
                const fetchGuides = await fetch(`/api/program/all/${profile.member_id}`);
                fetchGuides.json().then(result => {
                    setGuides(result)
                })
            }
        }

        loadHeadingData();
    }, [profileData])

    console.log(guides);

    return (
        <>
            <section className={styles["content"]}>
                <div className={styles["grid2"]}>
                    {guides.map((guide)=> (
                        <Link to={'#'} style={{textDecoration: 'none', color: 'inherit'}}>
                            <div className={styles["guideContent"]} key={guide.program_id}>
                                {/* <Link to={`/`}></Link> */}
                                <div className={styles["guideImage"]}>
                                <img src='' alt=''/>
                                </div>
                                <div className={styles["guideFooter"]}>
                                    <div className={styles["TitleDateContainer"]} >
                                        <h2>{guide.program_heading}</h2>
                                        <span className={styles["guideDate"]}>Last accessed: <Moment >{guide.program_datemodified}</Moment></span>
                                        </div> 
                                        <p>Click to View and Edit</p>
                                </div>
                            </div> 
                        </Link>
                    ))} 
                </div>
            </section>
        </>
    ) 
}

export default GuideCards;