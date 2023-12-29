import React, { useState } from 'react'
import styles from './Blog.module.css'
import BlogCards from './blogCards.jsx';

// Components 
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header.jsx';
import Modal from '../../components/modal/modal.jsx';


const Blogs = () => {
  const type = "enabler";

  return (
    <div className={styles['BlogPage']}>
      <SideBar />
      <div className={styles['layoutContainer']}>
          <div className={styles["Headline"]}>
            <Header />
          </div>
              <div className={styles["bodyContainer"]}>
                <h1>My Entries</h1>
                  <div className={styles["blogButtons"]}> {/*create button container*/}
                    <div className={styles["modalButton"]}>
                      <Modal />
                  </div>
                  </div>
                    <div className={styles["contents"]}> {/*conntent section container*/}
                      <BlogCards />
                    </div>
              </div>
        </div>        
    </div>
  )
}

export default Blogs
