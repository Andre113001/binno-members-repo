import React from 'react'
import { blog } from '../../assets/data'
import styles from './blogCards.module.css'

const BlogCards = () => {
  return (
    <>
        <section className={styles["blogContent"]}>
            <div className={styles["grid1"]}>
                {blog.map((item)=> (
                <div className={styles["box boxItems"]} key={item.id}> 
                <div className={styles["img"]}>
                <img src={item.cover} alt='' />
                    </div>
                        <div className={styles["details"]}>
                        <div className="tag">
                            <p>{item.category}</p>
                        </div>
                        <h3>{item.title}</h3>
                            <p>{item.desc.slice(0, 150)}...</p>
                            <div className={styles["date"]}>
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