import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../style.css";
import config from '../../../config';
import { Box, Typography } from '@mui/material';
import AddinItem from '../../../Components/AddinItem';


//images
import DiaryBaseImage from "../../../Assets/images/diary_base.png";
import InsideCoverBinder from "../../../Assets/images/insideCoverBinder.png";
import CalenderCover1 from "../../../Assets/images/CalenderCover1.png"
import CalenderCover2 from "../../../Assets/images/CalenderCover2.png"


export default function ReflectionPage({updatePriceBox}) {
  const [tab, setTab] = useState(true)
  const [weeklyTemplateList, setWeeklyTemplateList] = useState([])
  const [weeklyTemplateSelected, setWeeklyTemplateSelected] = useState([])
  const [monthlyTemplateList, setMonthlyTemplateList] = useState([])
  const [monthlyTemplateSelected, setMonthlyTemplateSelected] = useState([])
  const [leftPageImage, setLeftPageImage] = useState(CalenderCover1)
  const [rightPageImage, setRightPageImage] = useState(CalenderCover2)

  const [priceBox, setPriceBox] = useState(1);

  //load api data
  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;
    
    axios.get(`${BACKEND_URL}/api/V1/addins/Reflection`)
      .then(response => {
        const { templateList } = response.data.result;
        setWeeklyTemplateList(templateList.WeeklyReflection);
        setMonthlyTemplateList(templateList.MonthlyReflection);
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });

    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Addins")); 
    if(sessionData!==null){

      const WeeklyReflectionList = sessionData.WeeklyReflection;
      const MonthlyReflectionList = sessionData.MonthlyReflection;

      if(WeeklyReflectionList!==undefined){
        setWeeklyTemplateSelected((WeeklyReflectionList)? WeeklyReflectionList:[]);
        //show images of select template
        const index1 = WeeklyReflectionList.findIndex((item) => item.id === WeeklyReflectionList[0].templateId);
        weeklyTemplateList[index1] !== undefined && setLeftPageImage(weeklyTemplateList[index1].image);
        weeklyTemplateList[index1] !== undefined && setRightPageImage(weeklyTemplateList[index1].image2);
      }
      if(MonthlyReflectionList!==undefined){
        setMonthlyTemplateSelected((MonthlyReflectionList)? MonthlyReflectionList:[]);
        //show images of select template
        const index1 = MonthlyReflectionList.findIndex((item) => item.id === MonthlyReflectionList[0].templateId);
        monthlyTemplateList[index1] !== undefined && setLeftPageImage(monthlyTemplateList[index1].image);
        monthlyTemplateList[index1] !== undefined && setRightPageImage(monthlyTemplateList[index1].image2);
      }
    }

    updatePriceBox(priceBox+1);

  }, [ ]);


  //save data in session
  useEffect(() => { 
    
    var NewSessionData = JSON.parse(sessionStorage.getItem("Addins")); 
    if(NewSessionData!==null){
      NewSessionData['WeeklyReflection']=weeklyTemplateSelected;
      NewSessionData['MonthlyReflection']=monthlyTemplateSelected;
      sessionStorage.setItem("Addins", JSON.stringify(NewSessionData));
    }else{
      sessionStorage.setItem("Addins", JSON.stringify({ WeeklyReflection: weeklyTemplateSelected, MonthlyReflection: monthlyTemplateSelected, VisionAndGoal:[], Habits:[], FitnessFood:[], Work:[], Family:[],  Others:[] }))
    }
    
    updatePriceBox(priceBox+1);
    
  }, [weeklyTemplateSelected, monthlyTemplateSelected])


  

  const handleWeeklyTemplateSelected = (templateId, optType, count, tempSelected) => {
    // Check if the item is already selected and toggle its selection
    // Check if templateId already exists in selectedData
    
    if(tempSelected){
      const index = weeklyTemplateSelected.findIndex((item) => item.templateId === templateId);
      if (index === -1) {
        // If templateId is not found, add a new item
        setWeeklyTemplateSelected([...weeklyTemplateSelected, { templateId, optType, count }]);
      } else {
        // If templateId exists, update the existing item
        const updatedData = [...weeklyTemplateSelected];
        updatedData[index] = { templateId, optType, count };
        setWeeklyTemplateSelected(updatedData);
      }
    }else{
      if(weeklyTemplateSelected!==undefined && weeklyTemplateSelected.length>0){
        const updatedData = weeklyTemplateSelected.filter((item) => item.templateId !== templateId);
        setWeeklyTemplateSelected(updatedData);
      }
    }

    //show images of select template
    const index1 = weeklyTemplateList.findIndex((item) => item.id === templateId);
    weeklyTemplateList[index1] !== undefined && setLeftPageImage(weeklyTemplateList[index1].image)
    weeklyTemplateList[index1] !== undefined && setRightPageImage(weeklyTemplateList[index1].image2)
    
  }

  const handleMonthlyTemplateSelected = (templateId, optType, count, tempSelected) => {
    // Check if the item is already selected and toggle its selection
    // Check if templateId already exists in selectedData
    
    if(tempSelected){
      const index = monthlyTemplateSelected.findIndex((item) => item.templateId === templateId);
      if (index === -1) {
        // If templateId is not found, add a new item
        setMonthlyTemplateSelected([...monthlyTemplateSelected, { templateId, optType, count }]);
      } else {
        // If templateId exists, update the existing item
        const updatedData = [...monthlyTemplateSelected];
        updatedData[index] = { templateId, optType, count };
        setMonthlyTemplateSelected(updatedData);
      }
    }else{
      if(monthlyTemplateSelected!==undefined && monthlyTemplateSelected.length>0){
        const updatedData = monthlyTemplateSelected.filter((item) => item.templateId !== templateId);
        setMonthlyTemplateSelected(updatedData);
      }
    }

    //show images of select template
    const index1 = monthlyTemplateList.findIndex((item) => item.id === templateId);
    monthlyTemplateList[index1] !== undefined && setLeftPageImage(monthlyTemplateList[index1].image)
    monthlyTemplateList[index1] !== undefined && setRightPageImage(monthlyTemplateList[index1].image2)
    
  }


  const handleShowTemplate =(template)=>{
    template !== undefined && setLeftPageImage(template.image)
    template !== undefined &&  setRightPageImage(template.image2)
  }

  return (
    <>
      <Box className="PageInnerBox">
        <Box className="LeftPanelBox">
          <Box className="LeftHeader">
            <Typography className='LeftTitle'>What are reflection pages?</Typography>
          </Box>

          <Typography className='reflTabHeader'>
            Would you like to include monthly or weekly reflection pages?
          </Typography>

          <Box className="yearAndMonthTab">
            <Box onClick={() => setTab(true)} className={tab ? "activeTab yearTab" : "yearTab"}>
              <Typography sx={{ color: tab ? "black" : "#9e9e9e" }}>Weekly</Typography>
            </Box>
            <Box onClick={() => setTab(false)} className={tab ? "monthlyTab" : "activeTab monthlyTab"}>
              <Typography sx={{ color: tab ? "#9e9e9e" : "black" }}>Monthly</Typography>
            </Box>
          </Box>
          <Box className="TemplateContainerBox">

            <Box className="templateBox">
              <Typography className='templateHeader'>Choose your template</Typography>
              <Box className="reflTemplateBox">


                <Box id="weeklyTemplates" className="templateCardBox" sx={{display: tab? 'flex':'none'}}>
                  {weeklyTemplateList.map((template, index) => (
                    <AddinItem Type="Addins" templateData={template} OptSelect={'Weekly'} addinSelected={weeklyTemplateSelected} handleSelectedAddin={handleWeeklyTemplateSelected} handleCheckTemplate={handleShowTemplate} />
                  ))}
                </Box>
                <Box id="monthlyTemplates" className="templateCardBox" sx={{display: !tab? 'flex':'none'}}>
                  {monthlyTemplateList.length?
                    monthlyTemplateList.map((template, index) => (
                      <AddinItem Type="Addins" templateData={template} OptSelect={'Monthly'} addinSelected={monthlyTemplateSelected} handleSelectedAddin={handleMonthlyTemplateSelected} handleCheckTemplate={handleShowTemplate} />
                    )):
                      (<Box>No template found</Box>)
                    }
                </Box>
                
            </Box>
            </Box>
           
            
          </Box>
        </Box>


        <Box className="RightPanelBox">
          <Box className="RightHeader">
            <Typography mr={1} className='RightHeaderText'>Step 5:</Typography>
            <Typography className='RightSubText'>Select add-ins</Typography>
          </Box>

          <Box mt={3} className="PreviewContainer addins">
            <img src={DiaryBaseImage} className='diray_base' alt=""/>
            <Box className="diray_inner">
              <Box mr={1} className="diray_page">
                <Box className="dp1">
                  <img src={leftPageImage} className='PageSubImages'  alt=''/>
                </Box>
              </Box>
              <Box ml={1} className="diray_page right">
                <img className='insideCover_binder' src={InsideCoverBinder} />
                <Box className="dp2">
                  <img src={rightPageImage} className='PageSubImages'  alt=''/>
                </Box>
              </Box>
            </Box>
          </Box>


        </Box>

      </Box>
    </>
  )
}
