import React, { useState, useEffect } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GTic from "../../Assets/images/GTic.png (1).svg"
import PopUpImageSlider from "../../Components/PopUpImageSlider";
import { ButtonPrimary } from "../../Components/Buttons"


export default function HolidayDateBox({hdateData}) {


  

  return (
    <>
    <Box key={`Hdatebox-${hdateData.id}`} className="templateItem">{hdate.title}
        <Typography className='presetsEventsHeader'>{hdate.title}</Typography>
        <Typography className='checkBoxSubText'>To remove any holidays from your planner, simply uncheck</Typography>
        <Box mt={2} className="presetsEventsBox">
          <Box>
            <Box className="checkBoxItem">
              <input type="checkbox" />
              <Typography className='checkBoxSubText' ml={1}>SELECT ALL</Typography>
            </Box>
            {/*holidayDates[hdate.id]!==undefined && holidayDates[hdate.id].map((hdate,index) => {
              return (
                <Box className="checkBoxItem">
                  <input type="checkbox" />
                  <Typography className='checkBoxSubText' ml={1}>LABOUR DAY SEP 4,2023</Typography>
                </Box>
              )
              })*/}
          </Box>
        </Box>
      </Box>
    </>
  )

}