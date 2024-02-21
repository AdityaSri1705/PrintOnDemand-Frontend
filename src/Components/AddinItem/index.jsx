import React, { useState, useEffect } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GTic from "../../Assets/images/GTic.png (1).svg"
import PopUpImageSlider from "../../Components/PopUpImageSlider";
import { ButtonPrimary } from "../../Components/Buttons"


export default function AddinItem({Type, templateData, OptSelect, addinSelected, handleSelectedAddin, handleCheckTemplate}) {

  const [count, setCount] = useState(1);
  const [templeteSelected, setTempleteSelected] = useState(false);
  const [showOptionList, setShowOptionList] = useState(false);
  const [selectOptText, setSelectOptText] = useState(OptSelect);
  const [selectTitle, setSelectTitle] = useState("");
  const [selectImage, setSelectImage] = useState("");

  useEffect(() => {
    if (addinSelected !== undefined && addinSelected.length > 0) {
      const index = addinSelected.findIndex((item) => item.templateId === templateData.id);
      if (index !== -1) {
        setTempleteSelected(true);
        setSelectOptText(addinSelected[index].optType || OptSelect);
        setCount(addinSelected[index].count);
        setSelectTitle(addinSelected[index].title || templateData.title);
        setSelectImage(addinSelected[index].image || templateData.image);
      }
    }
  }, [addinSelected]);

  useEffect(() => {
    handleSelectedAddin(templateData.id, templateData.title, templateData.image, selectOptText, count, templeteSelected);
  },[templeteSelected, selectOptText, count]);

  const incrementCount = () => {
    setCount(count+1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count-1);
    }
  };

  const handleSelectedTemplate = ()=>{
     setTempleteSelected(!templeteSelected)
     setShowOptionList(!templeteSelected)
  }

  
  return (
    <>
    <Box key={`template-${templateData.id}`} className="templateItem">
      <Box   className="temCardTopBox">
        {<Box className="week_Box" onClick={() => setShowOptionList(true)}>
          <svg style={{ display: templeteSelected ? "block" : "none" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 10L12.5 14.5L17 10M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" stroke="#BC9448" stroke-width="2" stroke-linecap="round" />
          </svg>
          <Typography sx={{ display: templeteSelected ? "flex" : "none" }} className='temCardText'  >{selectOptText}</Typography>
        </Box>}
        <Box className="temCardTypeList" sx={{display: showOptionList? "block" : "none" }}>
          {Type=="Yearly" && <ul>
            <li onClick={() => {setSelectOptText('Front of Planner'); setShowOptionList(false);}}>Front of Planner</li>
            <li onClick={() => {setSelectOptText('Back of Planner'); setShowOptionList(false);}} >Back of Planner</li>
          </ul>}
          {Type=="Monthly" && <ul>
            <li onClick={() => {setSelectOptText('Front of Planner'); setShowOptionList(false);}}>Front of Planner</li>
            <li onClick={() => {setSelectOptText('Back of Planner'); setShowOptionList(false);}} >Back of Planner</li>
            <li onClick={() => {setSelectOptText('Monthly'); setShowOptionList(false);}}>Monthly</li>
          </ul>}
          {Type=="Addins" && <ul>
            <li onClick={() => {setSelectOptText('Front of Planner'); setShowOptionList(false);}}>Front of Planner</li>
            <li onClick={() => {setSelectOptText('Back of Planner'); setShowOptionList(false);}} >Back of Planner</li>
            <li onClick={() => {setSelectOptText('Weekly'); setShowOptionList(false);}}>Weekly</li>
            <li onClick={() => {setSelectOptText('Monthly'); setShowOptionList(false);}}>Monthly</li>
            <li onClick={() => {setSelectOptText('Quarterly'); setShowOptionList(false);}}>Quarterly</li>
          </ul>}
          
        </Box>
        {
          templeteSelected ?
            <svg onClick={handleSelectedTemplate} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C4.93281 0 0 4.93281 0 11C0 17.0672 4.93281 22 11 22C17.0672 22 22 17.0672 22 11C22 4.93281 17.0672 0 11 0Z" fill="#BC9448" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3193 7.29189C16.5857 7.5583 16.5857 7.99658 16.3193 8.26299L9.87402 14.7083C9.74082 14.8415 9.56465 14.9103 9.38848 14.9103C9.2123 14.9103 9.03613 14.8415 8.90293 14.7083L5.68027 11.4856C5.41387 11.2192 5.41387 10.781 5.68027 10.5146C5.94668 10.2481 6.38496 10.2481 6.65137 10.5146L9.38848 13.2517L15.3482 7.29189C15.6146 7.02119 16.0529 7.02119 16.3193 7.29189Z" fill="white" />
            </svg> :
            <svg onClick={handleSelectedTemplate} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#BC9448" stroke-width="2" />
              <path d="M6 10H16V12H6V10Z" fill="#BC9448" />
              <path d="M10 16V6H12V16H10Z" fill="#BC9448" />
            </svg>
        }

      </Box>
      <Box className="temCardImg">
        <img src={templateData.image} onClick={()=>handleCheckTemplate(templateData)} />
        
        <Box sx={{ opacity: templeteSelected ? "1" : "0" }} className="temCardBtnBox">
          <svg onClick={decrementCount} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#BC9448" stroke-width="2" />
            <rect x="6" y="10" width="10" height="2" fill="#BC9448" />
          </svg>
          <Typography className='temCountText'>{count}</Typography>
          <svg onClick={incrementCount} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#BC9448" stroke-width="2" />
            <path d="M6 10H16V12H6V10Z" fill="#BC9448" />
            <path d="M10 16V6H12V16H10Z" fill="#BC9448" />
          </svg>
        </Box>
      </Box>
      <Typography className='temCardBottomText'>{templateData.title}</Typography>
    </Box>
    </>
  )

}