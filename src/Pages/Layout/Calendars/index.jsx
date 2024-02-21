import React, { useState, useEffect } from 'react';
import { Typography, Box, Radio } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import "../../layout.css";
import "./style.css";
import config from '../../../config';
import AddinItem from '../../../Components/AddinItem';

import DiaryBaseImage from "../../../Assets/images/diary_base.png";
import InsideCoverBinder from "../../../Assets/images/insideCoverBinder.png";
import EmptyPage from "../../../Assets/images/EmptyPage.jpg";



export default function CalenderPage({updatePriceBox}) {

  const [layoutData, setLayoutData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const [imageData, setImageData] = useState([])
  const [sectionOptData, setSectionOptData] = useState("")
  const [templateData, setTemplateData] = useState("")
  const [leftPageImage, setLeftPageImage] = useState(EmptyPage)
  const [rightPageImage, setRightPageImage] = useState(EmptyPage)

  const [tab, setTab] = useState("")
  const [layoutTab, setLayoutTab] = useState("Hourly times")
  const [priceBox, setPriceBox] = useState(1);
  const [showMonth, setShowMonth] = useState(0);


  const [yearlyPlannerRadio, setYearlyPlannerRadio] = useState("");
  const [monthlyCalendarRadio, setMonthlyCalendarRadio] = useState("");
  const [monthlyPlannerRadio, setMonthlyPlannerRadio] = useState([""]);


  const [yearlyTemplateSelected, setYearlyTemplateSelected] = useState([]);
  const [monthlyTemplateSelected, setMonthlyTemplateSelected] = useState([]);

  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });

  const handleLayoutChange = (layout) => {
    setLayoutTab(layout.id);
    var sessionData = JSON.parse(sessionStorage.getItem("Calendar"));
  }
  const handleYearlyPlannerRadioChange = (event) => {
    setYearlyPlannerRadio(parseInt(event.target.value));
  };
 

  const handleMonthlyCalendarRadioChange = (event) => {
    setMonthlyCalendarRadio(parseInt(event.target.value));
  };
  
  const handlemonthlyPlannerRadiosChange = (event) => {
    setMonthlyPlannerRadio(parseInt(event.target.value));
  };


  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;
    
    axios.get(`${BACKEND_URL}/api/V1/layout/CalendarView`)
      .then(response => {
        const { layouts, sections, sectionOpts, templates } = response.data.result;

        setLayoutData(layouts);
        setSectionData(sections);
        setSectionOptData(sectionOpts);
        setTemplateData(templates);

        updatePriceBox(priceBox+1);
        
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });

  }, [ ]);

  useEffect(() => {
    var defaultParameters = "";
    layoutData.forEach((layout) => {
      setLayoutTab(layout.id);
      defaultParameters = { ...defaultParameters, layoutTab: layout.id }; 
    });
    
    // Check if sectionData is available and not empty
    if (sectionData ) {

      {Object.keys(sectionData).map((layoutId) => {
        {sectionData[layoutId].map((section,index) => {
  
          if (layoutId == 13 && index === 0 && section.default_val>0) {
            defaultParameters = { ...defaultParameters, yearlyPlannerRadio: section.default_val }; 
          }
          if (layoutId == 14 && index === 0 && section.default_val>0) {
            defaultParameters = { ...defaultParameters, monthlyCalendarRadio: section.default_val }; 
          }
          if (layoutId == 14 && index === 1 && section.default_val>0) {
            defaultParameters = { ...defaultParameters, monthlyPlannerRadio: section.default_val }; 
          }
        })}

        const yearlyTemplate = [];
        const monthlyTemplate = [];
        layoutData.forEach((layout) => {
          templateData[layout.id].forEach((template,index) => {
            if (layout.id == 13 && template.isDefault===1) {
              yearlyTemplate.push({templateId: template.id, OptType:"Weekly", count:1 });
            }
            if (layout.id == 14 && template.isDefault===1) {
              monthlyTemplate.push({templateId: template.id, OptType:"Monthly", count:1 });
              setShowMonth(true);
            }
          })
          defaultParameters = { ...defaultParameters, yearlyTemplateSelected:yearlyTemplate }; 
          defaultParameters = { ...defaultParameters, monthlyTemplateSelected:monthlyTemplate }; 
        });
      })}

    }
   

    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Calendar")); 
    // Merge default parameters with session data
    const mergedData = {  ...defaultParameters, ...sessionData  };

    setLayoutTab(mergedData.layoutTab);
    setYearlyPlannerRadio(mergedData.yearlyPlannerRadio);
    setMonthlyCalendarRadio(mergedData.monthlyCalendarRadio);
    setMonthlyPlannerRadio(mergedData.monthlyPlannerRadio);
    setYearlyTemplateSelected(mergedData.yearlyTemplateSelected);
    setMonthlyTemplateSelected(mergedData.monthlyTemplateSelected);

    updatePriceBox(priceBox+1);
    
  }, [layoutData, sectionData]); 

  useEffect(() => { 
    sessionStorage.setItem("Calendar", JSON.stringify({
      layoutTab: layoutTab, 
      yearlyPlannerRadio: yearlyPlannerRadio,
      monthlyCalendarRadio: monthlyCalendarRadio,
      monthlyPlannerRadio: monthlyPlannerRadio,
      yearlyTemplateSelected: yearlyTemplateSelected,
      monthlyTemplateSelected: monthlyTemplateSelected
    }));

    updatePriceBox(priceBox+1);
    
}, [layoutTab, yearlyPlannerRadio, monthlyCalendarRadio, monthlyPlannerRadio, yearlyTemplateSelected, monthlyTemplateSelected])


const handleYearlyTemplateSelected = (templateId, templateTitle, templateImage, optType, count, templeteSelected) => {
  // Check if the item is already selected and toggle its selection
  // Check if templateId already exists in selectedData
  
  if(yearlyTemplateSelected !==undefined){
    if(templeteSelected){
      const index = yearlyTemplateSelected.findIndex((item) => item.templateId === templateId);
      if (index === -1) {
        // If templateId is not found, add a new item
        setYearlyTemplateSelected([...yearlyTemplateSelected, { templateId, templateTitle, templateImage, optType, count }]);
      } else {
        // If templateId exists, update the existing item
        const updatedData = [...yearlyTemplateSelected];
        updatedData[index] = { templateId, templateTitle, templateImage, optType, count };
        setYearlyTemplateSelected(updatedData);
      }
    }else{
      if(yearlyTemplateSelected!==undefined && yearlyTemplateSelected.length>0 ){
        const updatedData = yearlyTemplateSelected.filter((item) => item.templateId !== templateId);
        setYearlyTemplateSelected(updatedData);
      }
    }
    setShowMonth(false)
  }

  //show images of select template
  if(templateData[layoutTab]!==undefined){
    const index1 = templateData[layoutTab].findIndex((item) => item.id === templateId);
    templateData[layoutTab][index1] !== undefined && setLeftPageImage(templateData[layoutTab][index1].image)
    templateData[layoutTab][index1] !== undefined && setRightPageImage(templateData[layoutTab][index1].image2)
  }
  
  
}


const handleMonthlyTemplateSelected = (templateId, templateTitle, templateImage, optType, count, templeteSelected) => {
  // Check if the item is already selected and toggle its selection
  // Check if templateId already exists in selectedData
  if(monthlyTemplateSelected !==undefined){
    const index = monthlyTemplateSelected.findIndex((item) => item.templateId === templateId);
    if(templeteSelected){
      if (index === -1) {
        // If templateId is not found, add a new item
        setMonthlyTemplateSelected([...monthlyTemplateSelected, { templateId, templateTitle, templateImage, optType, count }]);
      } else {
        // If templateId exists, update the existing item
        const updatedData = [...monthlyTemplateSelected];
        updatedData[index] = { templateId, templateTitle, templateImage, optType, count };
        setMonthlyTemplateSelected(updatedData);
        setShowMonth(true);
      }
    }else{
      if(index=>0){
        const updatedData = monthlyTemplateSelected.filter((item) => item.templateId !== templateId);
        setMonthlyTemplateSelected(updatedData);
      }
    }
  }

  //show images of select template
  if(templateData[layoutTab]!==undefined){
    const index1 = templateData[layoutTab].findIndex((item) => item.id === templateId);
    templateData[layoutTab][index1] !== undefined && setLeftPageImage(templateData[layoutTab][index1].image)
    templateData[layoutTab][index1] !== undefined &&  setRightPageImage(templateData[layoutTab][index1].image2)
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
            <Typography className='LeftTitle'>Monthly and Annual Calendars</Typography>
          </Box>
          
            <Box className="yearAndMonthBox">
              <Box className="yearAndMonthTab">
                {layoutData.map((layout, index) => (
                  <Box  key={`layout-${index}`}   onClick={()=>handleLayoutChange(layout)} className={layoutTab===layout.id ? "activeTab yearTab" : "yearTab"}>
                    <Typography sx={{ color: layoutTab===layout.id ? "black" : "#9e9e9e" }}>{layout.title}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
         
            <Box sx={{display: layoutTab===13? '':'none'}} className="CalenderRadioBox">
              <Box className="templateBox">
                <Typography className='templateHeader'>Choose your template</Typography>
                <Box className="templateCardBox">
                  {templateData[13] != undefined && templateData[13].map((template, index) => 
                    <AddinItem  key={`addins-${index}`} Type="Yearly" templateData={template} OptSelect={'Front of Planner'} addinSelected={yearlyTemplateSelected} handleSelectedAddin={handleYearlyTemplateSelected} handleCheckTemplate={handleShowTemplate} />
                  )}
                </Box>
              </Box>

            </Box>


          <Box sx={{display: layoutTab===14? '':'none'}} className="CalenderRadioBox MonthlyTab" >
            
            

            

            <Box className="templateBox">
              <Typography className='templateHeader'>Choose your template</Typography>
              <Box className="templateCardBox">
                {templateData[14] != undefined && templateData[14].map((template, index) => 
                  <AddinItem  key={`addins-${index}`} Type="Monthly" templateData={template} OptSelect={'Monthly'} addinSelected={monthlyTemplateSelected} handleSelectedAddin={handleMonthlyTemplateSelected} handleCheckTemplate={handleShowTemplate} />
                )}
              </Box>
            </Box>

            <Box className="CalRHeader">
              <Typography>{sectionData[layoutTab] != undefined && sectionData[layoutTab][1] != undefined && sectionData[layoutTab][1].section_title}</Typography>
            </Box>
            <Box>
            <Typography>(e.g., if your planner ends in June, this would include monthly calendars for July to December)</Typography>
            </Box>
            <Box className="fontBackRadioBox">
            {sectionOptData[67] != undefined && sectionOptData[67].map((sectionOpt, index) => (
              <Box key={`monthlyPlannerRadio-${sectionOpt.id}`} className="setTimeInRadioBox">
                <label className='radioLabel' >
                  <Radio
                    sx={{
                      color: '#B8845F',
                      '&.Mui-checked': {
                        color: '#B8845F',
                      },
                    }}
                    name='monthlyPlannerRadio'
                    value={sectionOpt.id}
                    checked={parseInt(monthlyPlannerRadio) === sectionOpt.id}
                    onChange={handlemonthlyPlannerRadiosChange}
                  />
                </label>
                <Typography>{sectionOpt.title}</Typography>
              </Box>
            ))}
             

            </Box>

          </Box>
        </Box>

        <Box className="RightPanelBox">
          <Box className="RightHeader">
            <Typography mr={1} className='RightHeaderText'>Step 4:</Typography>
            <Typography className='RightSubText'>Include Monthly and Annual Calendars</Typography>
          </Box>

          <Box mt={3} className="PreviewContainer calendar">
            <img src={DiaryBaseImage} className='diray_base' alt=""/>
            <Box className="diray_inner">
              <Box className="diray_page leftpage">
                <Box className="dp1">
                  {layoutTab===14 && showMonth && <div class="monthname">{monthName}</div>}
                  <img src={leftPageImage} className='PageSubImages'  alt=''/>
                </Box>
              </Box>
              <Box className="diray_page rightpage">
                <img className='insideCover_binder' src={InsideCoverBinder} alt='' />
                <Box className="dp2">
                  <img src={rightPageImage} className='PageSubImages' alt='' />
                </Box>
              </Box>
            </Box>
          </Box>

        </Box>

      </Box>
    </>
  )
}
