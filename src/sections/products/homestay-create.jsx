/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars, import/no-extraneous-dependencies
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';

import { Box, Select, MenuItem, Container, TextField, Typography, InputLabel, FormControl, Button, Grid, Divider  } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import numeral from 'numeral';
import ImageUpdateForm from './homestay-images';

// ----------------------------------------------------------------------

export default function HomeStayCreate() {
    const token = localStorage.getItem('token')

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        address: '',
        addressLink: '',
        googleDriveLink: '',
        selfCheckInLink: '',
        compoDiscount: 0,
        day: 0,
        overNight: 0,
        threeHours: 0,
        week: 0,
        time1Start: '',
        time1End: '',
        time2Start: '',
        time2End: '',
        time3Start: '',
        time3End: '',
        overNightStart: '',
        overNightEnd: '',
        images: []
      });
    
      const handleChange = (e) => {
        const {name} = e.target;
        let { value } = e.target;
        if(_.includes(['compoDiscount', 'day', 'overNight', 'threeHours', 'week'], name)){
          value = e.target.value.replace(/,/g, '');
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
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

      const handleSubmit = async (e) => {
        e.preventDefault();
        // Xử lý dữ liệu tại đây
        const data = {
          name: formData.name,
          slug: formData.slug,
          address: formData.address,
          addressLink: formData.addressLink,
          googleDriveLink: formData.googleDriveLink,
          selfCheckInLink: formData.selfCheckInLink,
          bookingTimeSlots: [
            {
              name: 'threeHours',
              startTime: formData.time1Start,
              endTime: formData.time1End,
            },
            {
              name: 'threeHours',
              startTime: formData.time2Start,
              endTime: formData.time2End,
            },
            {
              name: 'threeHours',
              startTime: formData.time3Start,
              endTime: formData.time3End,
            },
            {
              name: 'overNight',
              startTime: formData.overNightStart,
              endTime: formData.overNightEnd,
            }
          ],
          priceList: {
            threeHours: _.toNumber(formData.threeHours),
            overNight: _.toNumber(formData.overNight),
            day: _.toNumber(formData.day),
            week: _.toNumber(formData.week),
            compoDiscount: _.toNumber(formData.compoDiscount),
          },
          images: formData.images
        }

          try {
            let updateHomeStay = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/room`, data, {
              headers: {
                Authorization: token 
              }
            });
            updateHomeStay = updateHomeStay?.data;
            if (updateHomeStay?.code === 1000) {
              setToastInfo({
                type: 'success',
                message: 'Tạo thành công'
              });
            } else {
              setToastInfo({
                type: 'success',
                message: 'Tạo thất bại'
              });
            }
            setOpenToast(true);
        } catch (error) {
            console.log(`ERROR when call update homestay ${error.message} -- ${JSON.stringify(error)}`);
            setToastInfo({
              type: 'success',
              message: 'Tạo thất bại'
            });
            setOpenToast(true);
        }
      };

      const onChangeImages = (images) => {
        console.log('images', images);
        setFormData((prevData) => ({
          ...prevData,
          images
        }))
      }

      useEffect(() => {

    //     const fetchHomeStay = async () => {
    //       try {
    //           let homestayResult = await axios.post('https://booking-kohl-six.vercel.app/room/search');
    //           homestayResult = homestayResult?.data;
    //           if (homestayResult?.code === 1000) {
    //               setHomeStay(homestayResult?.data?.rooms);
    //           }
    //       } catch (error) {
    //           console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
    //       }
    //   }
    //   fetchHomeStay();
      }, [])
    

      return (
        <Box>
         <Box  mt={3} >
              <form onSubmit={handleSubmit}>
                <Box>
                    <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
                      Thông tin phòng
                    </Typography>

                    <Grid2 container spacing={2}>
                        <Grid2 xs={6} md={6} sm={6}>
                          <TextField
                            fullWidth
                            label="Tên"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                          />
                          </ Grid2>

                          <Grid2 xs={6} md={6} sm={6}>
                          <TextField
                            fullWidth
                            label="Slug"
                            variant="outlined"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid2>
                    </Grid2>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Địa chỉ"
                        variant="outlined"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Link địa chỉ (Google Map)"
                        variant="outlined"
                        name="addressLink"
                        value={formData.addressLink}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Link thông tin phòng (Google Drive)"
                        variant="outlined"
                        name="googleDriveLink"
                        value={formData.googleDriveLink}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Link thông tin check-in (Google Drive)"
                        variant="outlined"
                        name="selfCheckInLink"
                        value={formData.selfCheckInLink}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                </Box>
                <Box mt={3}>
                  <Divider style={{border: '1px solid', width: '100%'}} />
                </Box>
                <Box mt={3}>
                  <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
                    Giá
                  </Typography>
                  <Grid2 container spacing={2}>
                      <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="3 giờ"
                          variant="outlined"
                          name="threeHours"
                          value={numeral(formData.threeHours).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                        </ Grid2>

                        <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="Qua đêm"
                          variant="outlined"
                          name="overNight"
                          value={numeral(formData.overNight).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid2>
                  </Grid2>

                  <Grid2 container spacing={2}>
                      <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="Ngày"
                          variant="outlined"
                          name="day"
                          value={numeral(formData.day).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                        </ Grid2>

                        <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="Tuần"
                          variant="outlined"
                          name="week"
                          value={numeral(formData.week).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid2>
                  </Grid2>

                  <Grid2 container spacing={2}>
                    <Grid2 xs={12} md={12} sm={12}>
                          <TextField
                            fullWidth
                            label="Giảm giá"
                            variant="outlined"
                            name="compoDiscount"
                            value={numeral(formData.compoDiscount).format('0,0')}
                            onChange={handleChange}
                            margin="normal"
                          />
                    </Grid2>
                  </Grid2>

                </Box>

                <Box mt={3}>
                  <Divider style={{border: '1px solid', width: '100%'}} />
                </Box>
                <Box mt={3}>
                  <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
                    Khung giờ
                  </Typography>
                  <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
                        <Typography style={{marginTop: '25px', marginRight: '25px'}} variant="h7"  align="left" gutterBottom>
                          Khung giờ 1 : 
                        </Typography>
                        <Grid2 xs={4} md={4} sm={4}>
                          <Box>
                            <TextField
                              fullWidth
                              label="Thời gian bắt đầu"
                              variant="outlined"
                              type="time"
                              value={formData.time1Start}
                              name="time1Start"
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                        </ Grid2>
                        <Grid2 xs={2} md={2} sm={2} display="flex" justifyContent="center">
                              <Box display="flex" justifyContent="center"> <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '15px'}}> - </p> </Box>
                        </Grid2>

                        <Grid2 xs={4} md={4} sm={4}>
                        <Box>
                            <TextField
                              fullWidth
                              label="Thời gian kết thúc"
                              variant="outlined"
                              type="time"
                              name="time1End"
                              value={formData.time1End}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                      </Grid2>
                  </Grid2>

                  <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
                        <Typography style={{marginTop: '25px', marginRight: '25px'}} variant="h7" align="left" gutterBottom>
                          Khung giờ 2 :
                        </Typography>
                        <Grid2 xs={4} md={4} sm={4}>
                          <Box>
                            <TextField
                              fullWidth
                              label="Thời gian bắt đầu"
                              variant="outlined"
                              type="time"
                              name="time2Start"
                              value={formData.time2Start}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                        </ Grid2>
                        <Grid2 xs={2} md={2} sm={2} display="flex" justifyContent="center">
                              <Box display="flex" justifyContent="center"> <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '15px'}}> - </p> </Box>
                        </Grid2>

                        <Grid2 xs={4} md={4} sm={4}>
                        <Box>
                            <TextField
                              fullWidth
                              label="Thời gian kết thúc"
                              variant="outlined"
                              type="time"
                              name="time2End"
                              value={formData.time2End}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                      </Grid2>
                  </Grid2>

                  <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
                        <Typography style={{marginTop: '25px', marginRight: '25px'}} variant="h7"align="left" gutterBottom>
                          Khung giờ 3 : 
                        </Typography>
                        <Grid2 xs={4} md={4} sm={4}>
                          <Box>
                            <TextField
                              fullWidth
                              label="Thời gian bắt đầu"
                              variant="outlined"
                              type="time"
                              name="time3Start"
                              value={formData.time3Start}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                        </ Grid2>
                        <Grid2 xs={2} md={2} sm={2} display="flex" justifyContent="center">
                              <Box display="flex" justifyContent="center"> <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '15px'}}> - </p> </Box>
                        </Grid2>

                        <Grid2 xs={4} md={4} sm={4}>
                        <Box>
                            <TextField
                              fullWidth
                              label="Thời gian kết thúc"
                              variant="outlined"
                              name="time3End"
                              type="time"
                              value={formData.time3End}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                      </Grid2>
                  </Grid2>

                  <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
                        <Typography style={{marginTop: '25px', marginRight: '40px'}} variant="h7" align="left" gutterBottom>
                          Qua đêm : 
                        </Typography>
                        <Grid2 xs={4} md={4} sm={4}>
                          <Box>
                            <TextField
                              fullWidth
                              label="Thời gian bắt đầu"
                              variant="outlined"
                              name="overNightStart"
                              type="time"
                              value={formData.overNightStart}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                        </ Grid2>
                        <Grid2 xs={2} md={2} sm={2} display="flex" justifyContent="center">
                              <Box display="flex" justifyContent="center"> <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '15px'}}> - </p> </Box>
                        </Grid2>

                        <Grid2 xs={4} md={4} sm={4}>
                        <Box>
                            <TextField
                              fullWidth
                              label="Thời gian kết thúc"
                              variant="outlined"
                              name="overNightEnd"
                              type="time"
                              value={formData.overNightEnd}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputProps: {
                                  step: 1800, // 5 minutes
                                }
                              }}
                            />
                          </Box>
                      </Grid2>
                  </Grid2>

                </Box>

                <Box mt={3}>
                  <Divider style={{border: '1px solid', width: '100%'}} />
                </Box>
                <Box mt={3}>
                  <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
                    Hình ảnh
                  </Typography>
                  <ImageUpdateForm onChange={onChangeImages} imagesData={formData.images} />


                </Box>


                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Box>
              </form>
          </Box>
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
        </Box>
      );
    };
