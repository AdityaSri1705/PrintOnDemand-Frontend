import React, { useState } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GTic from "../../Assets/images/GTic.png (1).svg"
import PopUpImageSlider from "../../Components/PopUpImageSlider";
import { ButtonPrimary } from "../../Components/Buttons"


export default function CoverItemHome({coverData, handleSelectedCover, selectedCoverId}) {

    const handleSelectCover = ()=>{
      handleSelectedCover(coverData.id, coverData.front_image, coverData.back_image);
    }

    return (
      <>
      <Box className="CoverItem" key={`cover-${coverData.id}`}> 
        <img style={{ display: selectedCoverId === coverData.id ? "block" : "none" }} className='GTic' src={GTic}  alt="close"/>
        <img
          src={coverData.front_image}
          alt={coverData.title}
          onClick={handleSelectCover} 
        />
      </Box>
      </>
    )

}