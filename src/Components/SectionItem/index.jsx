import React, { useState } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GTic from "../../Assets/images/GTic.png (1).svg"
import PopUpImageSlider from "../../Components/PopUpImageSlider";
import { ButtonPrimary } from "../../Components/Buttons"


export default function CoverItem({coverData, handleCover, handleSelectedCover, selectedCoverId}) {

    const [showPopup, setShowPopup] = useState(false);

    const handleCoverPopup = ()=>{
      
      setShowPopup(true);
      handleCover(coverData.id, coverData.image);
    }
    const handleSelectCover = ()=>{
      setShowPopup(false);
      handleSelectedCover(coverData.id, coverData.image);
    }

    return (
      <>
      <Box className="natureCoverItem" key={`cover-${coverData.id}`}> {/* Add a unique key */}
        <img style={{ display: selectedCoverId === coverData.id ? "block" : "none" }} className='GTic' src={GTic}  alt="close"/>
        <img
          src={coverData.image}
          alt={coverData.title}
          onClick={handleCoverPopup} 
        />
      </Box>
      { showPopup && ( 
        <Box className='coverPopUp CoverItem'>
            <CancelOutlinedIcon color="action" onClick={() => setShowPopup(false)} className="coverPopUpClose" />
            <Box className="coverPImageBox">
                <Box className="coverPSlider">
                    <PopUpImageSlider images={coverData.images} />
                </Box>
                <Box className="coverPInfo">
                    <Typography mb={1} className="coverPtext">{coverData.title}</Typography>
                    <Typography mb={3} className="coverPtext">${coverData.price}</Typography>
                    <Typography mb={3} className="coverPdesc">{coverData.description}</Typography>
                    <ButtonPrimary buttonText="CHOOSE THIS COVER" width="206px" textSize="14px" handelClick={handleSelectCover} />
                </Box>
            </Box>
        </Box>
      )}
      </>
    )

}