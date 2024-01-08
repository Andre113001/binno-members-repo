import React, { useState } from 'react'
import styles from './Blog.module.css'
import BlogCards from './blogCards.jsx';
import { Link } from 'react-router-dom';

// Components 
import SideBar from '../../components/Sidebar/Sidebar.jsx';
import Header from '../../components/header/Header.jsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

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
                    <div className={styles["addButtonContainer"]}>
                      <Link to="/blogs/blogPage" style={{textDecoration:'none'}}>
                      <button className={styles["actualButton"]}><AddRoundedIcon />Create New Entry</button>
                      </Link>
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
