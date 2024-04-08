/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import 'moment/locale/vi'
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars, import/no-extraneous-dependencies
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import momentTimezone from 'moment-timezone'

import { Box, Select, MenuItem, Container, TextField, Typography, InputLabel, FormControl, Button, Grid, Divider, Dialog, DialogActions, DialogContent, DialogTitle  } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import numeral from 'numeral';
import HomeStayCreate from './homestay-create';
import ImageUpdateForm from './homestay-images';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

export default function HomeStayList() {
    const [homestay, setHomeStay] = useState([]);
    const [selectHomeStay, setSelectHomeStay] = useState({});
    const [selectRoomTitle, setSelectRoomTitle] = useState('');
    const [isShowCreateHomeStay, setIsShowCreateHomeStay] = useState(false);
    const [openConfirmDeleted, setOpenConfirmDeleted] = useState(false);

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
      images: [],
      rule: '',
      wifi: '',
      projector: '',
      daySpecial: 0,
      overNightSpecial: 0,
      threeHoursSpecial: 0,
      weekSpecial: 0,
      startSpecialDate: null,
      endSpecialDate: null
    });

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
  
    const handleChange = (e) => {
        const {name} = e.target;
        let { value } = e.target;
        if(_.includes(['compoDiscount', 'day', 'overNight', 'threeHours', 'week', 'daySpecial', 'overNightSpecial', 'threeHoursSpecial', 'weekSpecial'], name)){
          value = e.target.value.replace(/,/g, '');
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Xử lý dữ liệu tại đây
      const data = {
        id: selectHomeStay.id,
        name: formData.name,
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
          threeHours: formData.threeHours,
          overNight: formData.overNight,
          day: formData.day,
          week: formData.week,
          compoDiscount: formData.compoDiscount,
        },
        images: formData.images,
        projector: formData.projector,
        rule: formData.rule,
        wifi: formData.wifi,
      }

      if(formData.threeHoursSpecial !== 0 && formData.daySpecial !== 0 && formData.weekSpecial !== 0 && formData.overNightSpecial !== 0){
        const customPrice = {
          date: {
            from: moment(formData.startSpecialDate).startOf('day').toISOString(),
            to: moment(formData.endSpecialDate).endOf('day').toISOString()
          },
          priceList: {
            threeHours: _.toNumber(formData.threeHoursSpecial),
            overNight: _.toNumber(formData.overNightSpecial),
            day: _.toNumber(formData.daySpecial),
            week: _.toNumber(formData.weekSpecial),
          }
        }
        data.customPrice = customPrice;
      }

      if(formData.threeHoursSpecial === 0 && formData.daySpecial === 0 && formData.weekSpecial === 0 && formData.overNightSpecial === 0){
        data.customPrice = {};
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
              message: 'Cập nhật thành công'
            });
          } else {
            setToastInfo({
              type: 'success',
              message: 'Cập nhật thất bại'
            });
          }
          setOpenToast(true);
      } catch (error) {
          console.log(`ERROR when call update homestay ${error.message} -- ${JSON.stringify(error)}`);
          setToastInfo({
            type: 'success',
            message: 'Cập nhật thất bại'
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

    const handleChangeRoomTitle = (e) => {
      const selectedRoom = _.find(homestay, {id: e.target.value});
      setSelectRoomTitle(selectedRoom.id);
      setSelectHomeStay(selectedRoom);
      setFormData({
        name: selectedRoom?.name,
        slug: selectedRoom?.slug,
        address: selectedRoom?.address,
        addressLink: selectedRoom?.addressLink,
        googleDriveLink: selectedRoom?.googleDriveLink,
        selfCheckInLink: selectedRoom?.selfCheckInLink,
        compoDiscount: selectedRoom?.priceList?.compoDiscount,
        day: selectedRoom?.priceList?.day,
        overNight: selectedRoom?.priceList?.overNight,
        threeHours: selectedRoom?.priceList?.threeHours,
        week: selectedRoom?.priceList?.week,
        time1Start: selectedRoom?.bookingTimeSlots?.[0].startTime,
        time1End: selectedRoom?.bookingTimeSlots?.[0].endTime,
        time2Start: selectedRoom?.bookingTimeSlots?.[1].startTime,
        time2End: selectedRoom?.bookingTimeSlots?.[1].endTime,
        time3Start: selectedRoom?.bookingTimeSlots?.[2].startTime,
        time3End: selectedRoom?.bookingTimeSlots?.[2].endTime,
        overNightStart: selectedRoom?.bookingTimeSlots?.[3].startTime,
        overNightEnd: selectedRoom?.bookingTimeSlots?.[3].endTime,
        images: selectedRoom?.images,
        projector: selectedRoom.projector,
        rule: selectedRoom.rule,
        wifi: selectedRoom.wifi,
        daySpecial: selectedRoom?.customPrice?.priceList?.day || 0,
        overNightSpecial: selectedRoom?.customPrice?.priceList?.overNight || 0,
        threeHoursSpecial: selectedRoom?.customPrice?.priceList?.threeHours || 0,
        weekSpecial: selectedRoom?.customPrice?.priceList?.week || 0,
        startSpecialDate: moment(selectedRoom?.customPrice?.date?.from || momentTimezone().tz('Asia/Ho_Chi_Minh')),
        endSpecialDate: moment(selectedRoom?.customPrice?.date?.to || momentTimezone().tz('Asia/Ho_Chi_Minh'))
      });
    }

    const deletedHomeStay = async () => {
        try {
            const data = {
              id: selectHomeStay.id,
              isDeleted: true
            }
            let deletedResult = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/room`, data, {
              headers: {
                Authorization: token
              }
            });
            setOpenConfirmDeleted(false)
            deletedResult = deletedResult?.data;
            if (deletedResult?.code === 1000) {
              window.location.reload();
            } else {
              setToastInfo({
                type: 'error',
                message: 'Xóa thất bại'
              });
              setOpenToast(true);
            }
        } catch (error) {
            console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
            setOpenConfirmDeleted(false)
            setToastInfo({
              type: 'error',
              message: 'Xóa thất bại',
            });
            setOpenToast(true);
        }
    }
    const onCloseConfirmDelete = () => {
      setOpenConfirmDeleted(false);
    }

    const fetchHomeStay = async () => {
        try {
            let homestayResult = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/room/search`);
            homestayResult = homestayResult?.data;
            if (homestayResult?.code === 1000) {
                setHomeStay(homestayResult?.data?.rooms);
            }
        } catch (error) {
            console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
        }
    }

    useEffect(() => {

      fetchHomeStay();
    }, [])
    

      return (
        <Container maxWidth="lg">
          <Box mt={5}>
            <Grid2 container spacing={2}>
              <Grid2 xs={3} md={3} sm={2} display="flex" justifyContent="flex-start">
                <Typography variant="h4" align="center" >
                  {isShowCreateHomeStay ? 'Tạo phòng' : 'Quản lý phòng'}
                </Typography> 
              </Grid2>
              <Grid2 xs={9} md={9} sm={9} display="flex" justifyContent="flex-end">
                  <Button style={{marginRight: '10px'}} onClick={() => { setIsShowCreateHomeStay(false)}} variant="contained" color="primary">
                    Quản lý
                  </Button>
                  <Button onClick={() => { setIsShowCreateHomeStay(true)}} variant="contained" color="success">
                    Tạo
                  </Button>
              </Grid2>

            </Grid2>
          </Box>
          {isShowCreateHomeStay ? (<HomeStayCreate />) : (
          <>
  
          <Box mt={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="room-select-label">Danh sách phòng</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                label="Danh sách phòng"
                value={selectRoomTitle}
                onChange={handleChangeRoomTitle}
              >
                {homestay.map((room, index) => (
                  <MenuItem key={index} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mt={3}>
          <Divider style={{border: '1px solid', width: '100%'}} />
          </Box>

          {!_.isEmpty(selectHomeStay) && (
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
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="HDSD (máy chiếu)"
                        variant="outlined"
                        name="projector"
                        value={formData.projector}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Nội quy"
                        variant="outlined"
                        name="rule"
                        value={formData.rule}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Box>
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Wifi"
                        variant="outlined"
                        name="wifi"
                        value={formData.wifi}
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
                  <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
                    Giá áp dụng ngày đặc biệt
                  </Typography>
                  <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
                        <Grid2 xs={2} md={2} sm={2} marginTop="22px">
                        <Typography style={{marginTop: '25px', marginRight: '25px'}} variant="h7"  align="center" gutterBottom>
                          Thời gian áp dụng : 
                        </Typography>
                        </Grid2>

                        <Grid2 xs={10} md={10} sm={10} display="flex">
                        <LocalizationProvider dateAdapter={AdapterMoment} locale='vi' localeText={{}}>
                          <Grid2 xs={5} md={5} sm={5} display="flex" justifyContent="center">
                            <DatePicker
                              label="Từ ngày"
                              value={formData.startSpecialDate}
                              onChange={(newValue) => {
                                const params = {
                                  target: {
                                    name: 'startSpecialDate',
                                    value: newValue
                                  }
                                }
                                handleChange(params)
                              }}
                              format='DD/MM/YYYY'
                            />
                          </Grid2>

                          <Grid2 xs={2} md={2} sm={2}>
                              <Box display="flex" justifyContent="center"> <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '15px'}}> - </p> </Box>
                          </Grid2>

                          <Grid2 xs={5} md={5} sm={5} display="flex" justifyContent="center">
                            <DatePicker
                              label="Đến ngày"
                              value={formData.endSpecialDate}
                              onChange={(newValue) => {
                                const params = {
                                  target: {
                                    name: 'endSpecialDate',
                                    value: newValue
                                  }
                                }
                                handleChange(params)
                              }}
                              format='DD/MM/YYYY'
                            />
                          </Grid2>
                        </LocalizationProvider>
                          
                        </ Grid2>
                  </Grid2>
                  <Grid2 container spacing={2}>
                      <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="3 giờ"
                          variant="outlined"
                          name="threeHoursSpecial"
                          value={numeral(formData.threeHoursSpecial).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                        </ Grid2>

                        <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="Qua đêm"
                          variant="outlined"
                          name="overNightSpecial"
                          value={numeral(formData.overNightSpecial).format('0,0')}
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
                          name="daySpecial"
                          value={numeral(formData.daySpecial).format('0,0')}
                          onChange={handleChange}
                          margin="normal"
                        />
                        </ Grid2>

                        <Grid2 xs={6} md={6} sm={6}>
                        <TextField
                          fullWidth
                          label="Tuần"
                          variant="outlined"
                          name="weekSpecial"
                          value={numeral(formData.weekSpecial).format('0,0')}
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
                  {/* <Grid2 container spacing={2}>
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
                  </Grid2> */}

                </Box>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={() => {setOpenConfirmDeleted(true)}} color="error" style={{marginRight: '10px'}}>
                    Xóa
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Cập nhật
                  </Button>
                </Box>
              </form>
          </Box>
          )}

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

            <Dialog open={openConfirmDeleted} onClose={onCloseConfirmDelete} fullWidth maxWidth="xs">
                <DialogTitle style={{fontWeight: 'normal'}}>Bạn có chắc chắn muốn xóa HomeStay này ?</DialogTitle>
                <DialogContent>
                  {/* Nội dung khác có thể thêm vào đây nếu cần */}
                </DialogContent>
                <DialogActions>
                  <Button onClick={onCloseConfirmDelete} color="primary">
                    Không
                  </Button>
                  <Button onClick={() => deletedHomeStay()} color="error" variant="contained">
                    Có
                  </Button>
                </DialogActions>
            </Dialog>
          </>)}
        </Container>
      );
    };
