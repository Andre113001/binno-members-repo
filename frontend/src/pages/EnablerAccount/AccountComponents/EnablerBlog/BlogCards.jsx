import React from 'react'
import styles from './BlogCards.module.css'
import { blog } from '../../../../assets/EnablerAccountData'

const BlogCards = () => {
  return (
    <>
        <section className={styles["BlogPage"]}>     
            <div className={styles["titleContainer"]}>
                <h1>Recent Blogs</h1>
                <a href="/blogs">View all blogs...</a>
            </div>
            <div className={styles["content"]}>
                {blog.map((item)=> (
                <div className={styles["boxItems"]} key={item.id}> 
                        <div className={styles["img"]}>
                            <img src={item.cover} alt='' />
                        </div>
                    <div className={styles["details"]}>
                        <h3>{item.title}</h3>
                            <div className={styles["date"]}>
                            <h4>{item.date}</h4>
                            </div>
                        <p>{item.desc.slice(0,150)}...</p>    
                    </div>
                </div>
                ))} 
            </div>
        </section>
    </>
  ) 
}

export default BlogCards;