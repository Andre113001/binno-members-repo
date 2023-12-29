import React from 'react'
import './RegistrationForm.css'
import  { useState } from 'react';
import StyledToggleButton from '../../components/ToggleButton/ToggleButton';


function RegistrationForm() {
    

    const [formData, setFormData] = useState({
      institute: '',
      email: '',
      address: '',
    });

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
                    <StyledToggleButton currentPage={'Company'}/>
                </div>
                <p>Please fill up the required fields. </p>

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
                        <p>Email</p>
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

export default RegistrationForm;