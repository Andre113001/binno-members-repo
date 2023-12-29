import React from 'react'

import Copyright from '../../components/Copyright/Copyright';

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
    MarkEmailRead
} from '@mui/icons-material';

const MessagePassword = () => {
  return (
    <div>
      <Container component="main" maxWidth="xs">
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
    <Box sx={{ mt: 1 }}>
        <MarkEmailRead sx={{fontSize: 200, color: '#ff7a00'}}/>
    </Box>
    <Typography component="h1" variant="h4" sx={{mt: 2, mb: 2, fontWeight: 'bold'}}>
        Email Sent
    </Typography>
    <Typography component="h1" variant="subtitle1" align='center' sx={{mb: 3}}>
        Kindly check your Email linked to your access-key <br /> to change your password
    </Typography>
</Box>
<Copyright />
      </Container>
    </div>
  )
}

export default MessagePassword
