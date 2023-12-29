import React from 'react'
import {
    Typography,
    Link
} from '@mui/material';

const Copyright = () => {
  return (
    <div>
      <Typography style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '8px', // Add padding if needed
            }} variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
              BiNNO
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
    </div>
  )
}

export default Copyright
