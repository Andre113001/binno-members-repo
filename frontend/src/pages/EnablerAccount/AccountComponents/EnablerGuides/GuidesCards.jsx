import React from 'react'
import { guide } from '../../../../assets/EnablerAccountData'
import EditIcon from '@mui/icons-material/Edit';
import styles from './GuidesCards.module.css'


const GuideCards = () => {
  return (
    <>
        <section className={styles["GuidePage"]}>
            <div className={styles["titleContainer"]}>
                <h1>Recent Guides</h1>
                <a href="/guides">View all Guides...</a>
            </div>
            <div className={styles["grid2"]}>
                {guide.map((item)=> (
                    <div className={styles["guideContent"]} key={item.id}>
                        <div className={styles["guideImage"]}>
                        <img src={item.img} alt=''/>
                        </div>
                        <div className={styles["guideFooter"]}>
                            <div className={styles["TitleDateContainer"]} >
                            <h2>{item.title}</h2>
                            <p className={styles["guideDate"]}>Last accessed: {item.date}</p>
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