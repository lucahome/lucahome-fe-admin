/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import axios from 'axios';
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Alert, Snackbar } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const InfiniteScrollTable = (props) => {
  const { slot, subimitSearch } = props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const token = localStorage.getItem('token')


  // dialog delete
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // toast send email
  const [toastInfo, setToastInfo] = React.useState({
    type: 'success',
    message: ''
  });
  const [openToast, setOpenToast] = React.useState(false);
  const handleOpenToast = () => setOpenToast(true);
  const handleCloseToast = () => setOpenToast(false);
  const handleSendMail = async (bookingId) => {
    try {
      let result = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/booking/reSendMail`,
        { bookingId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('result', result);
      result = result?.data
        if(result?.code === 1000) {
            setToastInfo({
              type: 'success',
              message: 'Gửi email thành công'
            });  
        } else {
          setToastInfo({
            type: 'error',
            message: 'Gửi email thất bại'
          });
        }
    } catch (error) {
      console.log('SEND EMAIL ERROR', error);
      setToastInfo({
        type: 'error',
        message: 'Gửi email thất bại'
      });
    }
    handleOpenToast();
  }


  const hanleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleAgree = async (bookingId) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/booking/delete`,
        { bookingId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('\n - handleAgree - result:', result);
    } catch (error) {
      console.log('DELETE BOOKING ERROR', error);
    }
    setDialogOpen(false)
    subimitSearch()
  };

  const handleCancel = () => {
    setDialogOpen(false)
  };

  return (
    <div>
      <p>
        Booking ID:{' '}
        <span
          style={{
            color: 'rgb(223, 169, 116)',
            fontWeight: 'bold',
          }}
        >
          {slot.booking.bookingId}
        </span>
      </p>
      <p>Tên: {slot.booking.contactName}</p>
      <p>
        SĐT: {slot.booking.contactPhone} - {slot.booking.contactChannel}
      </p>
      {slot.booking.status === 'PENDING' && <p style={{ color: 'red' }}>Đang thanh toán . . .</p>}
      <div>
        <Button onClick={handleOpen} style={{marginTop: '-12px', marginBottom: '5px'}}>CCCD</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {_.map(slot.booking?.identifyCardNumber, (item, index) => 
                (
                    <div key={index}>
                    <img src={item} alt="cccd" />
                    </div>
                )
            )}
          </Box>
        </Modal>
      </div>
      <Button color="error" variant="outlined" onClick={hanleOpenDialog}>
        Xóa
      </Button>
      <Button color="success" variant="outlined" style={{marginLeft: '10px'}} onClick={() => handleSendMail(slot.booking.bookingId)}>
        Gửi mail
      </Button>
      <Snackbar 
        open={openToast} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{border: '1px solid', borderRadius: '5px'}}
        >
          <Alert onClose={handleCloseToast} severity={toastInfo.type} sx={{ width: '100%' }} style={{fontWeight: 'bolder'}}>
            {toastInfo.message}
          </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Booking này sẽ được xóa và không thể khôi phục lại. Khung giờ này cũng sẽ được trống.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button onClick={() => handleAgree(slot.booking.bookingId)} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InfiniteScrollTable;
