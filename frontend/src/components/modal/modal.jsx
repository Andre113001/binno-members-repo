import React, { useState, useEffect } from 'react'
import './modal.css'
import DropBox from '../dropbox/DropBox'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddIcon from '@mui/icons-material/Add';
import TextBox from './textBox';

export default function Modal() {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = event.target.elements.title.value;
    const category = event.target.elements.category.value;
    const description = event.target.elements.description.value;
    console.log('Form submitted:', { title, description, category});
    toggleModal();
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
    <button onClick={toggleModal} className="createBlog">
            <AddIcon/>Create a new Event
        </button>

        {modal && (
            <div className="modal">
              <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <div className="titleDateContainer">
                        <input 
                          type="text"
                          className='titleTextBox'
                          placeholder='Create new entry' 
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
                    <div className="texboxContainer">
                      <TextBox />
                      {/* <input 
                          type="text"
                          className='contentDetail'
                          placeholder='Write a Short description...'
                        /> */}
                    </div>
                    <div className="dropboxContainer">
                      <DropBox />
                    </div>
                    <button type="submit" className="uploadButton">  
                      Upload
                    </button>
                </div>
            </div>
        )}
    </>
  )
}
