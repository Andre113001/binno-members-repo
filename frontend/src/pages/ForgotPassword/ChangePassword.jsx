import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
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

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [tokenStatus, setTokenStatus] = useState(null);
    
    const token = queryParams.get("token");

    useEffect(() => {
        axios.post(`/api/password/resetTokenChecker`, {
            token: token
        })
        .then(response => {
            const data = response.data;
            if (data.message === 'Token is valid') {
                // Token is valid, show the new password form
                setTokenStatus('valid');
            } else {
                // Token is invalid, redirect to a different page
                setTokenStatus('invalid');
                navigate('/invalid-token'); // Adjust the path accordingly
            }
        })
        .catch(error => {
            console.error('Error making request', error);
            // Handle error, e.g., show an error message or redirect to an error page
            setTokenStatus('error');
        });
    }, [queryParams, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== passwordCheck) {
            console.log("Not Same");
        } else {
            axios.post(`/api/password/changePassword`, {
                token: token,
                newPassword: newPassword
            })
            .then(response => {
                navigate('/password-changed');
                // Add any additional logic here based on the response if needed
            })
            .catch(error => {
                console.error('Error making request', error.message);
                // Handle error
            });
        }
        
    };



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
                    Change Password
                </Typography>
                <Typography component="h1" variant="subtitle1" align='center' sx={{mb: 3}}>
                    Before submitting your new password, it's best to have good password etiquet
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="newPassword"
                        label="New Password"
                        name="newPassword"
                        autoComplete="off"
                        autoFocus
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        autoComplete="off"
                        autoFocus
                        type='password'
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
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
            </Box>
            <Copyright />
        </Container>
    )
}

export default ChangePassword
