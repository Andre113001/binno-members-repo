import React from 'react'

import Copyright from '../../components/Copyright/Copyright';

import {
    Button, 
    Box,
    Container,
    CssBaseline,
    Typography,
    Link,
} from '@mui/material';

import {
    Report,
    ArrowBackIos
} from '@mui/icons-material';

const TokenInvalid = () => {
  return (
    <div>
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
            <Box sx={{ mt: 1 }}>
                <Report sx={{fontSize: 200, color: '#eb0014'}}/>
            </Box>
            <Typography component="h1" variant="h4" sx={{mt: 2, fontWeight: 'bold'}}>
                Invalid Token
            </Typography>
            <Typography component="h1" variant="subtitle1" align='center' sx={{mb: 3}}>
                Sorry your token might either be invalid or expired. <br /> Please try again.
            </Typography>
        </Box>
        <Link color={'inherit'} href='/' style={{display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', fontSize: 15}}>
            <ArrowBackIos sx={{fontSize: 15}}/>  
            <span>Back to login</span>
        </Link>
        <Copyright />
      </Container>
    </div>
  )
}

export default TokenInvalid;
