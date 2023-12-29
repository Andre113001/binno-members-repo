import React, { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

export default function PickDate(){
    const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
        <DatePicker
            selected={selectedDate}
            className="datepickerContainer"
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/dd/yyyy"
        />
    </>
  );
  
};