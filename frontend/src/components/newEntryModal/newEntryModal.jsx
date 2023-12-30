import React, { useState, useEffect, useCallback } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import styles from "./newEntryModal.module.css"

export default function NewEntryModal() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(()=> { 
    const interValId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
  
    return () => clearInterval(interValId);

  }, []);
  
  const formatDateToText = () => {
    const dateYear = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return currentDate.toLocaleDateString(undefined, dateYear);
  }; 

    const [modal, setModal] = useState(false);    
    const toggleModal = () => {
      setModal(!modal);
    };
  
    if(modal) {
      document.body.classList.add('active-modal')
    } else {
      document.body.classList.remove('active-modal')
    }  
  
    return (
    <>
    <button onClick={toggleModal} className={styles["createBlog"]}>
            Create new blog
        </button>

        {modal && (
            <div className={styles["modal"]}>
              <div onClick={toggleModal} className={styles["overlay"]}></div>
                <div className={styles["modal-content"]}>
                    <div className={styles["titleDateContainer"]}>
                        <input 
                          type="text"
                          className={styles["titleTextBox"]}
                          placeholder='Create new entry' 
                        />
                        <p>{formatDateToText()}</p>
                    </div>

                    <button className={styles["close-modal"]} onClick={toggleModal}>
                    <CloseRoundedIcon />
                    </button>
                    <div className={styles["categoryTagContainer"]}>
                      <button className={styles["categoryButton"]}>Add to Category
                      </button>
                    </div>
                    <input 
                          type="text"
                          className={styles["contentDetail"]}
                          placeholder='Write a Short description...'
                        />
                    {/* <div className="dropboxContainer">
                      <DropBox />
                    </div> */}
                    <button className={styles["uploadButton"]} onClick={toggleModal}>  
                      Upload
                    </button>
                </div>
            </div>
        )}
    </>
  )
}
