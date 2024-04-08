/* eslint-disable no-useless-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable perfectionist/sort-imports */

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import axios from 'axios';
import _ from 'lodash';
import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChangePassView() {
  const theme = useTheme();

  const [changePassData, setChangePassData] = useState({
    username: '',
    oldPass: '',
    newPass: '',
    remindPass: ''
  })

  const changePass = async () => {
    try {
      const data = {
        username: changePassData.username,
        password: changePassData.oldPass,
        newPassword: changePassData.newPass
      }
        let loginResult = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/admin/changePassword`, data);
        loginResult = loginResult?.data;
        if (loginResult?.code === 1000) {
          setToastInfo({
            type: 'success',
            message: 'Đổi mật khẩu thành công. Sẽ được chuyển về trang login trong 3s.'
          });
          setOpenToast(true);
          localStorage.removeItem('token');

          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } 
    } catch (error) {
        console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
        const message = error?.response?.data?.message;
        if (message === 'Wrong password') {
          setToastInfo({
            type: 'error',
            message: 'Mật khẩu cũ không đúng.'
          });
          setChangePassData((prevData) => ({
            ...prevData,
            oldPass: '',
          }));
        } else if (message === 'Account not found') {
          setToastInfo({
            type: 'error',
            message: 'Không tìm thấy thông tin tài khoản.'
          });
          setChangePassData((prevData) => ({
            ...prevData,
            username: '',
          }));
        } else {
          setToastInfo({
            type: 'error',
            message: 'Đổi mật khẩu thất bại.'
          });
        }
        setOpenToast(true);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setChangePassData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    if(_.trim(changePassData.newPass) !== _.trim(changePassData.remindPass)) {
      setToastInfo({
        type: 'error',
        message: 'Mật khẩu mới và mật khẩu nhập lại không khớp. Vui lòng nhập lại!'
      });
      setChangePassData((prevData) => ({
        ...prevData,
        newPass: '',
        remindPass: ''
      }));
      setOpenToast(true);
      return;
    }

    if(_.isEmpty(changePassData.username) 
    ||_.isEmpty(changePassData.oldPass)
    || _.isEmpty(changePassData.newPass)
    || _.isEmpty(changePassData.remindPass)){
      setToastInfo({
        type: 'error',
        message: 'Không được để trống các thông tin'
      });
      setOpenToast(true);
      return;
    }

    changePass();
    // if(!_.isEmpty(loginData.username) && !_.isEmpty(loginData.password)) await login()
  };

  const [toastInfo, setToastInfo] = useState({
    type: 'error',
    message: ''
  });
  const [openToast, setOpenToast] = useState(false);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Tên tài khoản" value={changePassData.username} onChange={handleChange}/>

        <TextField
          name="oldPass"
          label="Mật khẩu cũ"
          value={changePassData.oldPass}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="newPass"
          label="Mật khẩu mới"
          value={changePassData.newPass}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="remindPass"
          label="Xác nhận mật khẩu mới"
          value={changePassData.remindPass}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Đổi mật khẩu
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Đổi mật khẩu</Typography>

          <Typography variant="body2" sx={{ mt: 0, mb: 0 }}>
            {/* Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link> */}
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button> */}
          </Stack>

          <Divider sx={{ my: 3 }}>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography> */}
          </Divider>

          {renderForm}
        </Card>
      </Stack>

      <Snackbar 
      open={openToast} 
      autoHideDuration={3000} 
      onClose={handleCloseToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toastInfo.type} sx={{ width: '100%' }}>
          {toastInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

