import React, { useState, useEffect } from 'react';
import styles from './GuideMain.module.css';
import GuideCards from './GuidesCards.jsx';
import SideBar from '../../components/Sidebar/Sidebar.jsx';
import Header from '../../components/header/Header.jsx';
import Modal from '../../components/modal/modal.jsx';
import useAccessToken from '../../hooks/useAccessToken.jsx';
import axios from 'axios';
import sha256 from 'sha256';

const GuideMain = () => {
  const [guides, setGuides] = useState('');
  const isAccessToken = useAccessToken();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const result = await axios.get(`http://localhost:3200/api/program/all/${sha256(isAccessToken)}`);
        setGuides(result);
      } catch (error) {
        console.log(error);
      }
    };

    if (isAccessToken) {
      fetchGuides();
    }
  }, [isAccessToken]);

  if (!isAccessToken) {
    // Access token not available, render loading or placeholder content
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles["GuideMainPage"]}>
        <SideBar />
        <div className={styles["layoutContainer"]}>
          <div className={styles["Headline"]}>
            <Header />
          </div>
          <div className={styles["bodyContainer"]}>
            <div className={styles["blogButtons"]}>
              <div className={styles["modalButton"]}>
                <Modal />
              </div>
            </div>
            <h1>My Guides</h1>
            <div className={styles["contents"]}>
              <GuideCards />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideMain;
