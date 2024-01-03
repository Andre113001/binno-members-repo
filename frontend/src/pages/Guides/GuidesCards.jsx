import React, { useState, useEffect } from 'react'
import { guide } from '../../assets/guide'
import EditIcon from '@mui/icons-material/Edit';
import styles from './GuidesCards.module.css'
import useLoadProfile from '../../hooks/useLoadProfile.jsx';
import Moment from 'react-moment';


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
                        <div className={styles["guideContent"]} key={guide.program_id}>
                            <div className={styles["guideImage"]}>
                            <img src='' alt=''/>
                            </div>
                            <div className={styles["guideFooter"]}>
                                <div className={styles["TitleDateContainer"]} >
                                <h2>{guide.program_heading}</h2>
                                <span className={styles["guideDate"]}>Last accessed: <Moment >{guide.program_datemodified}</Moment></span>
                                </div> 
                                <div className={styles["editButton"]}>
                                    <button>View and Edit<EditIcon/></button>
                                    </div>
                            </div>
                        </div> 
                    ))} 
                </div>
            </section>
        </>
    ) 
}

export default GuideCards;