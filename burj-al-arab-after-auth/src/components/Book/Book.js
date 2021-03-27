import DateFnsUtils from '@date-io/date-fns';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
    KeyboardDatePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import Bookings from '../Bookings/Bookings';

const Book = () => {
    const {bedType} = useParams();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date('2021-03-18T21:11:54'),
        checkOut: new Date('2021-04-18T21:11:54')
    });

    const handleCheckInDateChange = (date) => {
        const newDates = {...selectedDate}
        newDates.checkIn = date
        setSelectedDate(newDates);
    };
    const handleCheckOutDateChange = (date) => {
        const newDates = {...selectedDate}
        newDates.checkOut = date
        setSelectedDate(newDates);
    };

    const handleBooking =()=>{
        const newBooking = {...loggedInUser, ...selectedDate}
        fetch('http://localhost:3001/addBooking', {
            method:'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(newBooking)
        }).then(res=> res.json())
        .then(data => console.log(data))
    }

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Hello, {loggedInUser.name}! Let's book a {bedType} Room.</h1>
            <p>Want a <Link to="/home">different room?</Link> </p>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Check In"
          value={selectedDate.checkIn}
          onChange={handleCheckInDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Check Out"
          format="MM/dd/yyyy"
          value={selectedDate.checkOut}
          onChange={handleCheckOutDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
      <Button onClick={handleBooking} variant="contained" color="primary">
        Book now
    </Button>
    </MuiPickersUtilsProvider>
    <Bookings/>
    </div>
    );
};

export default Book;