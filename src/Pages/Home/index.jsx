import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import "./style.css"
import config from '../../config';

import axios from 'axios';


//Components
import NavBar from '../NavBar';
import Footer from '../Footer';
import AutoImageSlider from "../../Components/ImageSlider"
import GetStarted from './GetStarted';
import Stories from './Stories';
import Customize from './Customize';
import Design from "./Design"

export default function Home() {

  const [sliderData, setSliderData] = useState([]);
  const [stroriesData, setStroriesData] = useState([]);
  const [coverData, setCoverData] = useState([]);

  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;
    
    axios.get(`${BACKEND_URL}/api/V1/home`)
      .then(response => {
        setSliderData(response.data.result.sliders);
        setStroriesData(response.data.result.stories);
        setCoverData(response.data.result.covers);
      })
      .catch(error => {
        console.error('Error fetching slider data:', error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <Box className="homeContainer">
        <Box className="imageSliderBox" >
          <AutoImageSlider slider={sliderData} />
        </Box>
        <GetStarted coverList={coverData}/>
        <Customize />
        <Stories storyList={stroriesData}/>
        
        <Design />
      </Box>
      <Footer />
    </>
  )
}
