import React from 'react';
import "./style.css"
import { Box, Typography } from '@mui/material';

import cardImage1 from "../../../Assets/images/BYB_HOME_OTER_CLOCKS_1.png";
import cardImage2 from "../../../Assets/images/BYB_HOME_OTER_CLOCKS_2.png";
import cardImage3 from "../../../Assets/images/BYB_HOME_OTER_CLOCKS_3.png";
import MorePlannerImage from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_1.png";
import AboutImage from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_2.png";
import CommitmentImage from "../../../Assets/images/HOMEPAGE_Three_Ways_to_Get_Started_3.png";


export default function Design() {
  const DesignCard = (img, text, subText) => {
    return (
      <Box className="designCard">
        <Box className="designCardCover">
          <img src={img} alt='DesignCard' />
        </Box>
        <Box className="designCardTextBox">
          <Typography mb={3} className='designCardHeaderText'>{text}</Typography>
          <Typography className='designCardSubText'>{subText}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box className="designContainer">
        <Box className="designCardBox">
          {DesignCard(cardImage1, "Design the page layout that works for you!", "Design a daily or weekly planner page just for you, with pre-week planning, goal sheets, meal planning, habit tracking, and other customizable inserts!")}
          {DesignCard(cardImage2, "Beautiful and Durable Covers with Designer and Custom Options", "Your cover will be durable, classically gorgeous, and match seamlessly with your life.")}
          {DesignCard(cardImage3, "High quality, artisan paper for a better writing experience", "With a heavier weighted paper than most planners, your pages are beautiful, durable, and better for writing on.")}
        </Box>

        <Box className="planBox">
          <Typography className='planText'>See How it Works! Build Your Own Planner</Typography>
          <Box mt={5} className="planBtn">
            <Typography>Build My Planner</Typography>
          </Box>
        </Box>

        {/*<Box className="planBox">
          <Typography className='planText'>More About The Planners</Typography>
          <Box mt={5} className="storiesCard plan">
            <Box className="coverBox">
              <img src={MorePlannerImage} alt="About The Planners" />
            </Box>
            <Box className="storiesTextBox">
                <Typography>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, co</Typography>
            </Box>
          </Box>
        </Box>


        <Box className="planBox">
          <Typography className='planText'>About Us</Typography>
          <Box mt={5} className="storiesCard plan">
            <Box className="coverBox">
              <img src={AboutImage} alt="About The Planners" />
            </Box>
            <Box className="storiesTextBox">
                <Typography>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, co</Typography>
            </Box>
          </Box>
        </Box>


        <Box className="planBox">
          <Typography className='planText'>Our Commitments</Typography>
          <Box mt={5} className="storiesCard plan">
            <Box className="coverBox">
              <img src={CommitmentImage} alt="About The Planners" />
            </Box>
            <Box className="storiesTextBox">
                <Typography>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, co</Typography>
            </Box>
          </Box>
        </Box>*/}
      </Box>
    </>
  )
}
