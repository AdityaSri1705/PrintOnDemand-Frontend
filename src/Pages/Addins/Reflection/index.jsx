import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../style.css";
import config from '../../../config';
import { Box, Typography } from '@mui/material';
import AddinItem from '../../../Components/AddinItem';


//images
import DiaryBaseImage from "../../../Assets/images/diary_base.png";
import InsideCoverBinder from "../../../Assets/images/insideCoverBinder.png";
import EmptyPage from "../../../Assets/images/EmptyPage.jpg";


export default function ReflectionPage({updatePriceBox}) {
  const [tab, setTab] = useState(true)
  const [templateList, setTemplateList] = useState([])
  const [templateSelected, setTemplateSelected] = useState([])
  const [defaultTemplate, setDefaultTemplate] = useState([]);
  const [leftPageImage, setLeftPageImage] = useState(EmptyPage)
  const [rightPageImage, setRightPageImage] = useState(EmptyPage)

  const [priceBox, setPriceBox] = useState(1);

  //load api data
  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;
    
    axios.get(`${BACKEND_URL}/api/V1/addins/Reflection`)
      .then(response => {
        const { templateList } = response.data.result;
        setTemplateList(templateList);
        
        const templateDefault = templateList.find((item) => item.isDefault === 1);
        setDefaultTemplate(templateDefault)
        setLeftPageImage(templateDefault.image);
        setRightPageImage(templateDefault.image2);
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });

    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Addins")); 
    if(sessionData!==null){

      const ReflectionList = sessionData.Reflection;

      if(ReflectionList!==undefined){
        setTemplateSelected((ReflectionList)? ReflectionList:[]);
        //show images of select template
        const index1 = ReflectionList.findIndex((item) => item.id === ReflectionList[0].templateId);
        templateList[index1] !== undefined && setLeftPageImage(templateList[index1].image);
        templateList[index1] !== undefined && setRightPageImage(templateList[index1].image2);
      }
    }

    updatePriceBox(priceBox+1);

  }, [ ]);


  //save data in session
  useEffect(() => { 
    
    var NewSessionData = JSON.parse(sessionStorage.getItem("Addins")); 
    if(NewSessionData!==null){
      NewSessionData['Reflection']=templateSelected;
      sessionStorage.setItem("Addins", JSON.stringify(NewSessionData));
    }else{
      sessionStorage.setItem("Addins", JSON.stringify({ Reflection: templateSelected, VisionAndGoal:[], Habits:[], FitnessFood:[], Work:[], Family:[],  Others:[] }))
    }
    
    updatePriceBox(priceBox+1);
    
  }, [templateSelected])


  

  const handleTemplateSelected = (templateId, templateTitle, templateImage, optType, count, tempSelected) => {
    // Check if the item is already selected and toggle its selection
    // Check if templateId already exists in selectedData
    
    if(tempSelected){
      const index = templateSelected.findIndex((item) => item.templateId === templateId);
      if (index === -1) {
        // If templateId is not found, add a new item
        setTemplateSelected([...templateSelected, { templateId, templateTitle, templateImage, optType, count }]);
      } else {
        // If templateId exists, update the existing item
        const updatedData = [...templateSelected];
        updatedData[index] = { templateId, templateTitle, templateImage, optType, count };
        setTemplateSelected(updatedData);
      }

       //show images of select template
      const index1 = templateList.findIndex((item) => item.id === templateId);
      templateList[index1] !== undefined && setLeftPageImage(templateList[index1].image)
      templateList[index1] !== undefined && setRightPageImage(templateList[index1].image2)
    }else{
      if(templateSelected!==undefined && templateSelected.length>0){
        const updatedData = templateSelected.filter((item) => item.templateId !== templateId);
        setTemplateSelected(updatedData);

        //show next template images from selected Templated list. if no template seclected then it show empty image
        const id = updatedData.length>0? updatedData[0].templateId:0;
        if(id>0){
          const index1 = templateList.findIndex((item) => item.id === id);
          templateList[index1] !== undefined && setLeftPageImage(templateList[index1].image)
          templateList[index1] !== undefined && setRightPageImage(templateList[index1].image2)
        }else{
          setLeftPageImage(EmptyPage);
          setRightPageImage(EmptyPage);
        }
      }


    }
    
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

          {/*<Typography className='reflTabHeader'>
            Would you like to include monthly or weekly reflection pages?
          </Typography>

          <Box className="yearAndMonthTab">
            <Box onClick={() => setTab(true)} className={tab ? "activeTab yearTab" : "yearTab"}>
              <Typography sx={{ color: tab ? "black" : "#9e9e9e" }}>Weekly</Typography>
            </Box>
            <Box onClick={() => setTab(false)} className={tab ? "monthlyTab" : "activeTab monthlyTab"}>
              <Typography sx={{ color: tab ? "#9e9e9e" : "black" }}>Monthly</Typography>
            </Box>
          </Box>*/}
          <Box className="TemplateContainerBox">

            <Box className="templateBox">
              <Typography className='templateHeader'>Choose your template</Typography>
              <Box className="reflTemplateBox">


                <Box id="weeklyTemplates" className="templateCardBox" sx={{display: tab? 'flex':'none'}}>
                  {templateList.map((template, index) => (
                    <AddinItem key={`addin-${template.id}`} Type="Addins" templateData={template} OptSelect={'Weekly'} addinSelected={templateSelected} handleSelectedAddin={handleTemplateSelected} handleCheckTemplate={handleShowTemplate} />
                  ))}
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
              <Box mr={1} className="diray_page leftpage">
                <Box className="dp1">
                  <img src={leftPageImage} className='PageSubImages'  alt=''/>
                </Box>
              </Box>
              <Box ml={1} className="diray_page rightpage">
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
