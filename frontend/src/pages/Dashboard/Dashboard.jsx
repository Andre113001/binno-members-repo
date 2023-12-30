import React from 'react';
import BlogCards from './blogCards';
import EventCards from './EventCards';


import NewEventModal from '../../components/NewEventModal/NewEventModal.jsx';
import NewEntryModal from '../../components/NewEntryModal/NewEntryModal.jsx';
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header';
import styles from './Dashboard.module.css'


function Dashboard() {
  return (
    <>
    <div className={styles['DashboardPage']}>
      <SideBar />
      <div className={styles['layoutContainer']}>
        <div className={styles["Headline"]}>
          <Header />
          <div className={styles["contentType"]}>
            <div className={styles["blogTitleContainer"]}>
              <h1 className={styles['title']}>Blogs</h1>
                <div className={styles["createEntryButton"]}>
                  <NewEntryModal />
                </div>
            </div>

            <div className={styles["eventTitleContainer"]}>
              <h1 className={styles['title']}>Events</h1>
                <div className={styles["createEventButton"]}>
                  <NewEventModal />
                </div>
            </div>
            
          </div>
          
            <div className={styles["contents"]}>
              {/* <Switch>
                <Route exact path='/' Component={dashboard}/>
              </Switch> */}
              <div className={styles["blogContentsContainer"]}>
                <BlogCards />
              </div>
              <div className={styles["eventContentsContainer"]}>
                  <EventCards />
              </div>
            </div>
          </div>
        </div>        
      </div>
    </>
  );
}

export default Dashboard;
