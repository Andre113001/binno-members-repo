import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    TextField, 
    Button, 
    Box,
    Container,
    CssBaseline,
    Typography,
    Link,
} from '@mui/material';

import {
    ArrowBackIos
} from '@mui/icons-material'

// Components
import Copyright from '../../components/Copyright/Copyright';

const VerifyPassword = () => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(120);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        // event.preventDefault();

        // axios.post(`/api/member/verifyChangePassword`, {
        //     accesskey: accessKey
        // })
        // .then(response => {
        //     console.log('Response from localhost:3200', response.data);
        //     // Add any additional logic here based on the response if needed
        //     navigate('/verifyPassword');
        // })
        // .catch(error => {
        //     console.error('Error making request', error.message);
        //     // Handle error
        // });
    };

    // useEffect to handle the timer
    useEffect(() => {
        let intervalId;

        // Decrease the timer every second
        if (timer > 0) {
        intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        } else {
        // Timer reached 0, perform any action needed
        clearInterval(intervalId);
        // Example: Redirect to another page
        navigate('/timeoutPage');
        }

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [timer, navigate]);



    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />

            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <img src="../../../public/img/binno-logo.png" alt="" />
                <Typography component="h1" variant="h4" sx={{mt: 2, fontWeight: 'bold'}}>
                    Verify OTP
                </Typography>
                <Typography component="h1" variant="subtitle1" align='center' sx={{mb: 3}}>
                    Enter your OTP we've sent to your email.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        style={{textAlign: 'center'}}
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="Enter OTP"
                        name="otp"
                        autoComplete="off"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 5, p: 1.5}}
                        style={{
                            backgroundColor: "#599ef3",
                        }}
                        onClick={handleSubmit}
                    >
                    Submit
                    </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {timer > 0 ? `Time remaining: ${timer} seconds` : 'Time expired'}
                </Typography>
            </Box>
            <Copyright />
        </Container>
    )
}

export default VerifyPassword
