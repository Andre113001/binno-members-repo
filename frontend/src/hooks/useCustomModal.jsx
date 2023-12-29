import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 10,
  borderRadius: 5,
};

function useCustomModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const CustomModal = ({ content, additions }) => (
    <div>
      <Modal
        className='relative'
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon onClick={handleClose} className='absolute left-50 right-5 top-5 cursor-pointer' />
          {content}
          {additions}
        </Box>
      </Modal>
    </div>
  );

  return {
    handleOpen,
    handleClose,
    CustomModal,
  };
}

export default useCustomModal;
