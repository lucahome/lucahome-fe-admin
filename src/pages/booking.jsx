/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import _ from 'lodash';
import 'moment/locale/vi'
import axios from 'axios';
// import momentTimezone from 'moment-timezone';
import moment from 'moment';
import Select from 'react-select';
import { Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import BookingByRoomTable from './bookingByRoom';

const InfiniteScrollTable = (props) => {
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [homeStayIdList, setHomeStayIdList] = useState([]);
  const [homestay, setHomeStay] = useState([]);
  const [roomFilterSelect, setRoomFilterSelect] = useState(null);

  const fetchRoomAvailable = async ({ roomId, from, to }) => {
    try {
      setLoading(true);
      const queryParams = {};
      if (roomId) queryParams.roomId = roomId;
      if (from) queryParams.from = from;
      if (to) queryParams.to = to;
      console.log(
        '\n - file: adminTable.js:33 - fetchRoomAvailable - queryParams:',
        queryParams
      );

      let response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/room/checkAvailable`,
        queryParams
      );
      response = response?.data || {};

      setBookingData(response?.data);
    } catch (error) {
      console.log(
        `[ERROR] => call api /room/checkAvailable error ${
          error.message
        } -- ${JSON.stringify(error)}`
      );
    }
    setLoading(false);
  };

  const fetchHomeStay = async () => {
    setLoading(true);
    try {
      let homestayResult = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/room/search`
      );
      homestayResult = homestayResult?.data;

      if (homestayResult?.code === 1000) {
        setHomeStay(homestayResult?.data?.rooms);

        const homeStayNewFormat = [];
        _.forEach(homestayResult?.data?.rooms, (item) => {
          homeStayNewFormat.push({
            value: item.id,
            label: item.name
          });
        });
        if (homeStayNewFormat.length > 0) {
          setHomeStayIdList(homeStayNewFormat);
        }
      }
    } catch (error) {
      console.log(
        `ERROR when call get list homestay ${error.message} -- ${JSON.stringify(
          error
        )}`
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    // set room id
    // setRoomId(roomFilterSelect?.value);

    const start = moment()
      .tz('Asia/Ho_Chi_Minh')
      // .subtract(1, 'days')
      .startOf('day')
      // .toDate();
    setStartDate(start);

    const end = moment()
      .tz('Asia/Ho_Chi_Minh')
      .add(14, 'days')
      .startOf('day')
      // .toDate();
    setEndDate(end);

    fetchHomeStay();

    // fetchRoomAvailable({
    //   from: start,
    //   to: end
    // });
  }, []);

  const subimitSearch = () => {
    setBookingData({});
    fetchRoomAvailable({
      roomId: roomFilterSelect?.value,
      from: startDate,
      to: endDate
    });
  }

  return (
    <div className='admin-table'>
      {/* <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={roomFilterSelect}
          label="Phòng"
          onChange={(optionSelected) => {
            setRoomFilterSelect(optionSelected);
          }}
        >
          {_.map(homeStayIdList, (item, index) => (
            <MenuItem key={index} value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select> */}
      <LocalizationProvider dateAdapter={AdapterMoment} locale='vi' localeText={{}}>
        <DatePicker
          label="Từ ngày"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue)
          }}
        />
        <DatePicker
          label="Đến ngày"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue)
          }}
        />
      </LocalizationProvider>
      <div className='select-option'>
        <label htmlFor='guest'>Phòng:</label>
        <Select
          className='basic-single'
          classNamePrefix='select'
          value={roomFilterSelect}
          isClearable
          isSearchable
          options={homeStayIdList}
          onChange={(optionSelected) => {
            setRoomFilterSelect(optionSelected);
          }}
          placeholder='Tất cả phòng'
        />
      </div>
      <button
          className='admin-search-button'
          type='submit'
          style={{
            height: '33px',
            backgroundColor: '#DFA974',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            letterSpacing: '2px',
            fontFamily: `"Cabin", sans-serif`,
            fontSize: '11px',
            margin: '10px 10px'
          }}
          onClick={subimitSearch}
        >
          Tìm kiếm
        </button>
      {_.map(bookingData, (bookingByRoom, index) => (
          <BookingByRoomTable
            bookingData={bookingByRoom}
            homeStay={homestay.find(
              (item) => item.id === bookingByRoom?.roomId
            )}
            key={index}
            subimitSearch={subimitSearch}
          />
        ))}
      {loading && (
        <div className='loading-spinner' style={{
          marginTop: '20px',
        }}>
          <Spinner animation='border' variant='primary' />
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTable;
