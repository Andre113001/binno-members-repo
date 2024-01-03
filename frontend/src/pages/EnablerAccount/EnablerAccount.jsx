import React, {useState, useEffect} from 'react'
import styles from './EnablerAccount.module.css'

import InformationTab from './AccountComponents/EnablerInformationTab/InformationTab'
import GuideCards from './AccountComponents/EnablerGuides/GuidesCards'
import BlogCards from './AccountComponents/EnablerBlog/BlogCards'
import EventCards from './AccountComponents/EnablerEvents/EventCards'

import SideBar from '../../components/Sidebar/Sidebar';
import AccountHeader from './AccountComponents/AccountHeader/AccountHeader'
import useAccessToken from '../../hooks/useAccessToken'
import useLoadProfile from '../../hooks/useLoadProfile'

function EnablerAccount() {
  const {profileData} = useLoadProfile();
  const [data, setData] = useState([]);
  
  useEffect(() => {
      const loadHeadingData = async () => {
          if (profileData) {
              const result = await profileData;
              setData(result)
          }
      }

      loadHeadingData();
  }, [profileData])

  return (
    <>
    <div className={styles["EnablerAccountPage"]}>
      <SideBar />
      <div className={styles["layoutContainer"]}>
          <div className={styles["Headline"]}>
            <AccountHeader userType={data.user_type} institution={data.setting_institution}/>
          </div>
            <div className={styles["bodyContainer"]}>
              <div className={styles["CompanyInfoGuidesContainer"]}>
                  <InformationTab
                      description={data.setting_bio}
                      address={data.setting_address}
                      email={data.email_address}
                      phone={data.contact_number}
                      fb={data.contact_facebook}
                  />
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
