import React, {useState} from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css';
import axios from 'axios'

// Import Components

function Login() {
    const options = ['Startup Enabler', 'Startup Company']
    const defaultOption = options[0]

    // const [accessKey, setAccessKey] = useState('');
    // const [password, setPassword] = useState('');
    // const [selectedOption, setSelectedOption] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');

    // const handleAccessKeyChange = (event) => {
    //     setAccessKey(event.target.value);
    // };

    // const handlePasswordChange = (event) => {
    //     setPassword(event.target.value);
    // };

    // const handleOptionChange = (option) => {
    //     setSelectedOption(option.value);
    // };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    // };

    // try {
    //     const response = axios.post('http://172.17.80.1:3001/login', {
    //         accessKey,
    //         password,
    //     });

    //     if (response.status === 200) {
    //         console.log('Login Successful', response.data);
    //     }
    // } catch (error) {
    //     if (error.response && error.response.status === 401) {
    //         setErrorMessage('Invalid Credentials');
    //     } else {
    //         setErrorMessage('Internal Server Error');
    //     }
    // }

    return (    
        <>
            <div className='card-body'>
                <div className="card-container">
                    <h1 className='heading-1'>
                        Login
                    </h1>
                    <form 
                        // onSubmit={handleSubmit} 
                        action="http://localhost:3001/get" 
                        className='flex flex-col'
                    >
                        <input 
                            className='form-input border' 
                            type="text" 
                            name="access-key" 
                            id="access-key" 
                            placeholder='Enter Access Key...' 
                            // value={accessKey}
                            // onChange={handleAccessKeyChange}
                        />
                        {/* <label htmlFor="access-key">Access Key</label> */}

                        <input 
                            className='form-input border' 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder='Enter Password...' 
                            // value={password}
                            // onChange={handlePasswordChange}
                        />
                        {/* <label htmlFor="access-key">Password</label> */}

                        <Dropdown 
                            className='form-input'
                            options={options} 
                            value={defaultOption} 
                            // onChange={handleOptionChange}
                            placeholder="Select an option" 
                        />

                        <input className='btn-orange'  type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
