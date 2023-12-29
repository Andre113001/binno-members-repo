import React from 'react'
import './EnablerRegForm.css'
import  { useState, useEffect, useRef } from 'react';
import StyledToggleButton from '../../components/ToggleButton/ToggleButton';

function EnablerRegForm() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const dropdownRef = useRef();


    const [formData, setFormData] = useState({
        typeofEnaber: '',
        institute: '',
        email: '',
        address: '',
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // const handleOptionClick = (option) => {
    //     setSelectedOption(option);
    //     setIsMenuOpen(false);
    //   };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setFormData((prevFormData) => ({
          ...prevFormData,
          typeofEnaber: option, // Assuming "typeofEnaber" corresponds to the selected option
        }));
        toggleMenu(); // Close the dropdown after selecting an option
      };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
      };

  return (
    <>
        <div className="formPage">
            <h1>Become a Member</h1>
                <div className="switchUser">
                    <StyledToggleButton  currentPage={'Enabler'}   
                    />
                </div>

                <p>Please fill up the required fields. </p>

                    <div className="enablerTypeButton" ref={dropdownRef}>
                        <button className="dropdown-button" onClick={toggleMenu} onSubmit={handleSubmit}>
                            {selectedOption || 'Select what type of Startup Enbabler'}
                        </button> 
                        {isMenuOpen && (
                            <div className="EnablerTypes">
                                <p onClick={() => handleOptionClick('Technology Business Incubation')}>Technology Business Incubation</p>
                                <p onClick={() => handleOptionClick('Local Government Unit')}>Local Government Unit</p>
                                <p onClick={() => handleOptionClick('State Universities and Colleges')}>State Universities and Colleges</p>
                            </div>
                        )}
                    </div>    

                <form className='formContent' onSubmit={handleSubmit}>
                
                    <div>
                        <p>Name of Institution</p>
                            <input
                                className='institutionForm'
                                type="text"
                                placeholder='name of institution...'
                                id="institute"
                                name="institute"
                                value={formData.institute}
                                onChange={handleChange}
                                required
                            />
                    </div>
                    <div >
                        <p>E-mail</p>
                            <input
                                type="email"
                                placeholder='email address here...'
                                className='emailForm'
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                    </div>
                    <div >
                        <p>Address </p>
                            <input
                                type="text"
                                placeholder='address here...'
                                className='addressForm'
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    <div>
                        <button className='registerButton' type="submit">Submit</button>
                    </div>
                </form>
        </div>
    </>
  )

}

export default EnablerRegForm;