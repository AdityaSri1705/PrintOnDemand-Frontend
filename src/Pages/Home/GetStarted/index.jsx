import React, {useState} from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import "./style.css"

import HomeCoverItem from "../../../Components/CoverItemHome"
import CardImage1 from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_1.png"
//import CardImage2 from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_2.png"
//import CardImage3 from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_3.png"


export default function GetStarted({coverList}) {

  const navigate =  useNavigate();

  const handleSelectedCover = (id, front_img, back_img)=>{ 
    sessionStorage.setItem("Cover", JSON.stringify({
      CoverType:'predesign', 
      CoverId: id, 
      FrontImage: front_img,
      BackImage: back_img
    }));
    navigate("/cover#FirstPage")
  }


  return (
    <>
      <Box className="getStartedContainer Home">
        <Box className="getStartedHeader">
          <Typography>How to Get Started</Typography>
        </Box>
        <Typography className="getStartedHeaderSmall">Choose a Cover</Typography>
        <Box className="coverCardBox">
        {coverList.map((cover, coverIndex) => (
            <>
            <HomeCoverItem key={`${coverIndex}`} coverData={cover} handleSelectedCover={handleSelectedCover} />
          </>
        ))}
          {/*CoverCard(CardImage1, "Select a cover")*/}
          {/*CoverCard(CardImage2, "5-Question")*/}
          {/*CoverCard(CardImage3, "Choose & Customize Your Layout")*/}
        </Box>
        <Box className="button seecovers" onClick={()=>navigate("/cover")}>
          <Typography>See More Covers</Typography>
        </Box>
      </Box>
    </>
  )
}
