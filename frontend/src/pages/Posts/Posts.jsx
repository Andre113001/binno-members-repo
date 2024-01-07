import React, { useState } from 'react'
import {posts} from '../../assets/posts.js'

import SideBar from '../../components/Sidebar/Sidebar'
import Header from '../../components/header/Header'
import styles from './Posts.module.css'
import {
  StyledTabs, //parent component
  StyledTab,
  TabPanel,
} from "./Tabs";
import PanelContent from './PanelContent';
import { Category } from '@mui/icons-material'

const Posts = () => {
  
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
};

  return (
    <>
      <div className={styles['PostPage']}>
      <SideBar />
      <div className={styles['layoutContainer']}>
          <div className={styles["Headline"]}>
            <Header />
          </div>
              <div className={styles["bodyContainer"]}>
                <h1>Categories</h1>
                <div className={styles["tabContainer"]}>
                <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <StyledTab label="All Posts" />
                  <StyledTab label="Milestone"  />
                  <StyledTab label="Promotions" />
                </StyledTabs>
                <TabPanel value={value} index={0}>
                  <PanelContent filteredPosts={posts}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <PanelContent filteredPosts={posts.filter((post) => {
                    return post.category === 'Milestone';
                    })}/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <PanelContent filteredPosts={posts.filter((post) => {
                    return post.category === 'Promotions';
                    })}/>
                </TabPanel>
                </div>
              </div>
        </div>        
      </div>
    </>
  )
}

export default Posts
