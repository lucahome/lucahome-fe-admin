/* eslint-disable prefer-const */
import _ from 'lodash';
import numeral from 'numeral';
/* eslint-disable react/prop-types */
import * as React from 'react';
import momentTimezone from 'moment-timezone';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import BookedCell from './bookedCell';

export default function DenseTable(props) {

    // const [loading, setLoading] = React.useState(false);

    const { bookingData, homeStay = {}, subimitSearch } = props;
    let { bookingTimeSlots } = homeStay;

    const header = ['Thứ', 'Ngày'];

    _.forEach(bookingTimeSlots, (slot) => {
        if (slot?.name === 'threeHours')
          header.push(`${slot?.startTime} - ${slot?.endTime}`);
        if (slot?.name === 'overNight')
          header.push(`Qua đêm ${slot?.startTime} - ${slot?.endTime}`);
      });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" className='booking-by-room'>
        <TableHead>
        <TableRow>
        <TableCell align="center" colSpan={header.length} style={{
                border: '1px solid #dee2e6', textAlign: 'center',
                verticalAlign: 'center',
                padding: '15px',
                fontSize: '18px'}}>
                <b>{homeStay.name}</b>
              </TableCell>
          </TableRow>
          <TableRow>
            {header.map((item, id) => (
              <TableCell align="center" key={id} style={{border: '1px solid #dee2e6'}}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        
        <TableBody className='booking-byRoom-table'>
        {_.map(bookingData?.dateAvailable, (item, index) => {
            const dayOfWeek = momentTimezone(item?.date).day();
            const dayOfWeekStr = [
              'Chủ nhật',
              'Thứ 2',
              'Thứ 3',
              'Thứ 4',
              'Thứ 5',
              'Thứ 6',
              'Thứ bảy'
            ][dayOfWeek];
            return (
              <TableRow key={index}>
                <TableCell component="th" align='center' scope="row" style={{border: '1px solid #dee2e6'}}> {dayOfWeekStr} </TableCell>
                <TableCell component="th" align='center' scope="row" style={{border: '1px solid #dee2e6'}}> 
                  {momentTimezone(item?.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')} 
                </TableCell>
                {_.map(item?.bookingTimeSlots, (slot, i) => (
                  <TableCell key={i} component="th" scope="row" style={{border: '1px solid #dee2e6'}} className={
                    slot.isAvailable ? 'empty-room' : 'filled-room'
                  }>
                    {slot.isAvailable ? <p>Còn trống</p> : (
                      <BookedCell slot={slot} subimitSearch = {subimitSearch} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )
        })}
        <TableRow>
          <TableCell align="center" colSpan={header.length} style={{
                border: '1px solid #dee2e6', textAlign: 'center',
                verticalAlign: 'center',
                padding: '15px',
                fontSize: '18px'}}>
                <b>Tổng doanh thu: {numeral(bookingData?.statistic?.revenue).format('0,0')} đ</b>
            </TableCell>
        </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}