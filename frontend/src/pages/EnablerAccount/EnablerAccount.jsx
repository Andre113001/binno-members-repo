import styles from './EnablerAccount.module.css'

import InformationTab from './AccountComponents/EnablerInformationTab/InformationTab'
import GuideCards from './AccountComponents/EnablerGuides/GuidesCards'
import BlogCards from './AccountComponents/EnablerBlog/BlogCards'
import EventCards from './AccountComponents/EnablerEvents/EventCards'

import SideBar from '../../components/sidebar/SideBar'
import AccountHeader from './AccountComponents/AccountHeader/AccountHeader'


function EnablerAccount() {

  return (
    <>
    <div className={styles["EnablerAccountPage"]}>
      <SideBar />
      <div className={styles["layoutContainer"]}>
          <div className={styles["Headline"]}>
            <AccountHeader />
          </div>
            <div className={styles["bodyContainer"]}>
              <div className={styles["CompanyInfoGuidesContainer"]}>
                  <InformationTab/>
                  <div className={styles["guideContainer"]}>
                    <GuideCards />
                  </div>
                  
              </div>
                <div className={styles["BlogEventContainer"]}>
                    <BlogCards />
                    <EventCards />
                </div>
            </div>
        </div>        
      </div>

    </>
  )
}

export default EnablerAccount;
