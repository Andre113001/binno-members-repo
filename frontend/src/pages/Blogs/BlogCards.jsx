import React from 'react'
import styles from './BlogCard.module.css'
import { blog } from '../../assets/data'


const BlogCards = () => {
  return (
    <>
        <section className={styles['content']}>
            <div className={styles["grid2"]}>
                {blog.map((item)=> (
                <div className={styles['boxItems']} key={item.id}> 
                        <div className={styles['img']}>
                            <img src={item.cover} alt='' />
                        </div>
                        <div className={styles["contentUserInfoContainer"]}>
                            <h2>{item.user}</h2>
                            <h4>{item.userType}</h4>
                        </div>
                    <div className={styles["details"]}>
                        {/* <div className="tag">
                            <p>{item.category}</p>     //optional tag category
                        </div> */}
                        <h3>{item.title}</h3>
                            <p>{item.desc.slice(0,250)}...</p>
                            <div className={styles['date']}>
                            <h4>{item.date}</h4>
                        </div>
                    </div>
                </div>
                ))} 
            </div>
        </section>
    </>
  ) 
}

export default BlogCards;