import React, {useState} from 'react'
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

const ForgotPassword = () => {
    const [accessKey, setAccessKey] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post(`/api/member/verifyChangePassword`, {
            accesskey: accessKey
        })
        .then(response => {
            console.log('Response from localhost:3200', response.data);
            if (response.data.message === "Email Sent") {
                // Redirect to the verifyPassword page
                navigate('/change-password-sent');
            } else {
                // Handle other cases if needed
                console.warn('Unexpected response message:', response.data.message);
            }
        })
        .catch(error => {
            console.error('Error making request', error.message);
            // Handle error
        });
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
                    Forgot Password
                </Typography>
                <Typography component="h1" variant="subtitle1" align='center' sx={{mb: 3}}>
                    Enter your Access Key and we'll send you an email to reset your password.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="access-key"
                        label="Access Key"
                        name="access-key"
                        autoComplete="off"
                        autoFocus
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
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
                <Link color={'inherit'} href='/' style={{display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', fontSize: 15}}>
                    <ArrowBackIos sx={{fontSize: 15}}/>  
                    <span>Back to login</span>
                </Link>
            </Box>
            <Copyright />
        </Container>
    )
}

export default ForgotPassword
