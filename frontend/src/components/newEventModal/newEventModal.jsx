import React, { useState, useEffect } from 'react'
import './newEventModal.css'
import PickDate from './datePicker';
import DropBox from '../dropbox/DropBox';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


export default function NewEventModal() {
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
    <button onClick={toggleModal} className="createEvent">
            Create new event
        </button>

        {modal && (
            <div className="eventModal">
              <div onClick={toggleModal} className="overlay"></div>
                <div className="eventModalContent">
                    <div className="titleDateContainer">
                        <input 
                          type="text"
                          className='titleTextBox'
                          placeholder='Create new event' 
                        />
                        <p>{formatDateToText()}</p>
                    </div>

                    <button className="close-modal" onClick={toggleModal}>
                    <CloseRoundedIcon />
                    </button>
                    <div className="categoryTagContainer">
                      <button className='categoryButton'>Add to Category
                      </button>
                    </div>
                      <div className="datepickerContainer">
                        <p>Select a date</p>
                        <PickDate />
                      </div>
                    <input 
                          type="text"
                          className='contentDetail'
                          placeholder='Write a Short description...'
                        />
                    <div className="eventModalDropboxContainer">
                      <DropBox />
                    </div>
            
                    <button className='uploadButton' onClick={toggleModal}> 
                      Upload
                    </button>
                </div>
            </div>
        )}
    </>
  )
}
