import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';


export default function TextBox() {

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 4, width: '1250px' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Write a short description"
            style={{ maxHeight: '250px' ,height: '150px',maxWidth:'1300px' ,width: '100%', 
              margin: "20px", border:"rgb(241,241,241)", backgroundColor:"rgb(241,241,241)"}}
            minRows={4}
          />
        </div>
    </Box>
    </div>
  )
}
