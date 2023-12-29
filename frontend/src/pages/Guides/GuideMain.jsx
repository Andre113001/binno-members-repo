import React from 'react'
import styles from './GuideMain.module.css'

// Components
import GuideCards from './GuidesCards.jsx';
import SideBar from '../../components/sidebar/SideBar';
import Header from '../../components/header/Header.jsx';
import Modal from '../../components/modal/modal.jsx'

const GuideMain = () => {
  return (
    <>
    <div className={styles["GuideMainPage"]}>
      <SideBar />
      <div className={styles["layoutContainer"]}>
          <div className={styles["Headline"]}>
            <Header />
          </div>
              <div className={styles["bodyContainer"]}>
                  <div className={styles["blogButtons"]}> {/*create button container*/}
                    <div className={styles["modalButton"]}>
                      <Modal />
                    </div>
                  </div>                      
                  <h1>My Guides</h1>
                    <div className={styles["contents"]}> {/*conntent section container*/}
                      <GuideCards />
                    </div>
              </div>
        </div>        
      </div>
    </>
  )
}

export default GuideMain
