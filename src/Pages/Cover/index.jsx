import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Typography, Box } from '@mui/material';
//import { FileDrop } from 'react-file-drop'
import config from '../../config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import "../layout.css";
import "./style.css";






import coverPhoto from "../../Assets/images/CoverPhoto.png";
import fileDropIcon from "../../Assets/images/cloud_upload.svg";
import InsideCoverBinder from "../../Assets/images/insideCoverBinder.png"
import DiaryBaseImage from "../../Assets/images/diary_base.png";
import GTic from "../../Assets/images/GTic.png (1).svg"

//Component 
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from '../../Components/PriceBox';
import CoverItem from "../../Components/CoverItem"
import UploadPopup from "../../Components/UploadPopup"
import { Height } from '@mui/icons-material';


export default function Cover() {
  const location = useLocation();
  const hashValue = location.hash.replace("#","");

  const [tab, setTab] = useState(hashValue=="FirstPage"? false:true)
  const fileFrontInputRef = useRef(null);
  const fileBackInputRef = useRef(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear+1;
  
  const [checkboxFront, setCheckboxFront] = useState(true);
  const [checkboxBack, setCheckboxBack] = useState(false);

  const [diaryYear, setDiaryYear] = useState(currentYear+"-"+nextYear);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameLoad, setNameLoad] = useState(false);
  const [emailLoad, setEmailLoad] = useState(false);
  const [phoneLoad, setPhoneLoad] = useState(false);
  const [messageLoad, setMessageLoad] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [coverOption, setCoverOption] = useState(3);
  const [coverCategoryData, setCoverCategoryData] = useState([]);
  const [coversData, setCoversData] = useState([]);

  const [coverImage, setCoverImage] = useState(coverPhoto);
  const [selectedCoverId, setSelectedCoverId] = useState("");
  const [coverThumbnail, setCoverThumbnail] = useState("")

  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [showCustomCover, setShowCustomCover] = useState(false);
  const [customFrontImage, setCustomFrontImage] = useState("");
  const [customBackImage, setCustomBackImage] = useState("");
  const [customCoverPreview, setCustomCoverPreview] = useState("");

  const [imagePopup, setImagePopup] = useState(false);
  const [imageUploadType, setImageUploadType] = useState(false);
  const [priceBox, setPriceBox] = useState(1);
  const [menuPopInfo, setMenuPopInfo] = useState(true);
  

  useEffect( () => {
    
    const BACKEND_URL = config.BACKEND_URL;
    
    const fetchCoverCategories = async () => {
      await axios.get(`${BACKEND_URL}/api/V1/covers/`)
        .then( response => {
          setCoverCategoryData(response.data.result.categories);
          setCoversData(response.data.result.covers);
         
        })
        .catch(error => {
          console.error('Error fetching cover Categories data:', error);
        });
    }
    fetchCoverCategories();

    //load cover data from session on pageload
    //var coverData = SessionUtils.getDiarySession("Cover");
    
    
    var coverData = sessionStorage.getItem("Cover"); 
    if (coverData!== null) {
       coverData = JSON.parse(coverData);
       if(coverData.CoverType==="predesign"){
          setSelectedCoverId(coverData.CoverId);
          setCoverImage(coverData.FrontImage);
     
          setFrontImage("");
          setBackImage("");
          setShowCustomCover(false);
          setPriceBox(priceBox+1);
       }
       if(coverData.CoverType==="custom"){
        setSelectedCoverId(0);
        setCoverImage("");
        setFrontImage(coverData.FrontImage);
        setBackImage(coverData.BackImage);
        setShowCustomCover(true);
        setPriceBox(priceBox+1);
      }

    }
     //load cover data from session on pageload
     var FirstPageData = sessionStorage.getItem("FirstPage"); 
     if (FirstPageData!== null) {   
      FirstPageData = JSON.parse(FirstPageData);
      if (Array.isArray(FirstPageData) && FirstPageData.length > 0) {
        setDiaryYear(FirstPageData?.Year);
        setName(FirstPageData?.Name);
        setEmail(FirstPageData?.Email); 
        setPhone(FirstPageData?.Phone);
        setMessage(FirstPageData?.Message);
        setPriceBox(priceBox+1);
        setNameLoad(true);
        setEmailLoad(true);
        setPhoneLoad(true);
        setMessageLoad(true);
      }
   
    }

  }, []);


  const handleCheckboxFrontChange = () => {
    setCheckboxFront(!checkboxFront);
  };

  const handleCheckboxBackChange = () => {
    setCheckboxBack(!checkboxBack);
 };

 const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
}

  const onFrontFileInput = async  (event) => {
    const files = event.target.files;
    if(checkboxFront && files.length===1 ){
      const dataURL1 = await readFileAsDataURL(files[0]);
      setCustomFrontImage(dataURL1);
      setImageUploadType("Front");
      setImagePopup(true);
    }
  }

  const onBackFileInput = async  (event) => {
    const files = event.target.files;
    if(checkboxBack && files.length===1 ){
      const dataURL1 = await readFileAsDataURL(files[0]);
      setCustomBackImage(dataURL1);
      setImageUploadType("Back");
      setImagePopup(true);
    }
  }
 

  /*const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if((checkboxFront || checkboxBack) && files.length===1 ){
      const dataURL1 = await readFileAsDataURL(files[0]);
      if(!checkboxFront  && checkboxBack)
        setBackImage(dataURL1);
      else
        setFrontImage(dataURL1);

      setImagePopup(true);
      
    }else{

      try {
        const dataURL1 = await readFileAsDataURL(files[0]);
        const dataURL2 = await readFileAsDataURL(files[1]);
        
        setFrontImage(dataURL1);
        setBackImage(dataURL2);
        setImagePopup(true);
      } catch (error) {
        console.error('Error reading files:', error);
      }
    } 
   
    
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };*/

  const handleSelectedCover = (cover)=>{ 
    setSelectedCoverId(cover.id);
    setCoverImage(cover.front_image);
    setCoverThumbnail(cover.images[0].image);
    setShowCustomCover(false);
    setFrontImage("");
    setPriceBox(priceBox+1);
    
    sessionStorage.setItem("Cover", JSON.stringify({
      CoverType:'predesign', 
      CoverId: cover.id, 
      FrontImage: cover.front_image,
      BackImage: cover.back_image,
      price: cover.price
    }));
  }

  const handleCustomCover = (type,img)=>{ 
    console.log("Custom Front Image=>", type, img, frontImage, backImage);
    
    
    setCustomCoverPreview(img)
    setCoverThumbnail(img)
    setShowCustomCover(true);
    setImagePopup(false);
    setPriceBox(priceBox+1);
    
    if(type=="back"){
      setBackImage(img);
      sessionStorage.setItem("Cover", JSON.stringify({
        CoverType:'custom', 
        FrontImage: frontImage, 
        BackImage: img,
        price: 70
      }));
    }else{
      setFrontImage(img);
      sessionStorage.setItem("Cover", JSON.stringify({
        CoverType:'custom', 
        FrontImage: img, 
        BackImage: backImage,
        price: 70
      }));
    } 
    
  }

  const handleCustomCancel = () =>{
    setFrontImage("");
    setBackImage("");
    setCustomCoverPreview("");
    setCoverThumbnail("");
    setCustomFrontImage("");
    setCustomBackImage("");
    setPriceBox(priceBox+1);
    sessionStorage.removeItem('Cover');
  }
  
  const handleFirstPage = ()=>{
    setFormSubmitted(true)
    if(name!=="" ){
      console.log("FirstPage=>",diaryYear,name,email,phone,message)
      sessionStorage.setItem("FirstPage", JSON.stringify({
        Year: diaryYear, 
        Name: name || '', 
        Email: email || '', 
        Phone: phone || '',
        Message: message || ''
      }));
      console.log("FirstPage2=>",sessionStorage.getItem("FirstPage"))
      setShowNext(true)
      setPriceBox(priceBox+1);
      toast("First Page information has saved",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    }
    
    
    
  }
  
  const handleNextUrl = (flag) =>{
    if(flag=="FirstPage"){
      setTab(false);
    }else{
      setTab(true);
    }
    
  }

  const selectCoverThumbnail = (imgObj)=>{
    console.log(imgObj)
    setCoverImage(imgObj.image)
    setCoverThumbnail(imgObj.image)
  }
  const selectCustomThumbnail = (img)=>{
    console.log(img)
    setCustomCoverPreview(img)
    setCoverThumbnail(img)
  }


  return (
    <>
      <NavBar setNextBtnUrl={handleNextUrl}/>
      <Box className="PageContainer">
        <Box className="SubNav">
          <Box className="CnavItem">
            <Typography className={tab ? "navFont" : null} onClick={() => setTab(true)}>Cover</Typography>
          </Box>
          <Box className="CnavItem">
            <Typography className={tab ? null : "navFont"} onClick={() => setTab(false)}>First Page</Typography>
          </Box>
          <Box className={menuPopInfo? 'PopInfo arrow-top open':'PopInfo'}>
            <Box className="PopInfo-wrapper">
              <Typography className="PopInfoClose" onClick={()=>setMenuPopInfo(false)}>X</Typography>
              <Typography className="PopInfoText">
                <span>What's Here</span>
                You'll see two menu options in the submenu above: “Cover” and “First Page.” These two pages are for selecting your cover and creating your own personalized first page.
              </Typography>
              <Typography className="PopInfoText">
                <span>The Design Bar</span>
                Use the design bar to the left to find and select your cover. Once selected, push “next” and you can then create your personalized front page with your name, contact info, and a personal message.
              </Typography>
              <Typography className="PopInfoText">Let the creativity and fun begin! 😃</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="PageBox">

            {/* CoverBox1 */}
            <Box sx={{ display: tab ? "flex" : "none" }} className="CoverBox1 PageInnerBox ">
              <Box className="LeftPanelBox noscroll">
                <Box className="LeftHeader">
                  <Typography className='LeftTitle'>Cover Options</Typography>
                  <Typography className='LeftSubText'>To pick your pattern, select a category and explore....</Typography>
                </Box>
                
              
                <Box className="coverOptionItems">
                {coverCategoryData.map((cat, index) => ( 
                    <Box key={`covercat${index}`} onClick={() => setCoverOption(cat.id)} sx={{ background: coverOption === cat.id ? "#e9e9e9" : "#fff" }}  className="coverOptionItem">
                        <Typography>{cat.title} </Typography>
                    </Box>
                ))}
                  
                  <Box key={`covercat-custom`} onClick={() => setCoverOption("Custom")} sx={{ background: coverOption === "Custom" ? "#e9e9e9" : "#fff" }} className="coverOptionItem">
                    <Typography>Custom</Typography>
                  </Box>
                </Box>
                

                <Box className="ChooseFileBox">
                  
                  {coversData.map((cat, index) => (
                    <Box
                      sx={{
                        display: coverOption === cat.cat_id ? "flex" : "none",
                      }}
                      className={`Box${cat.cat_id} PreCoverBox`}
                      key={`cat${index}`} // Use a unique key based on index or cat.cat_id
                    >
                      {cat.coverList.map((cover, coverIndex) => (
                         <Box className="CoverItem" key={`cover-${cover.id}`}> {/* Add a unique key */}
                          <img style={{ display: selectedCoverId === cover.id ? "block" : "none" }} className='GTic' src={GTic}  alt="close"/>
                          <img
                            src={cover.front_image}
                            alt={cover.title}
                            onClick={()=>handleSelectedCover(cover)} 
                          />
                        </Box>
                      ))}
                    </Box>
                  ))}

                  <Box sx={{ display: coverOption === "Custom" ? "block" : "none" }} className="customBox">
                    <Box className="ChFHeaderBox">
                      <Typography className='chFHeaderText'>Custom Upload</Typography>
                      {/*<Typography className='chFSubText'>Want to upload a corporate or group cover? Please email <span>support@becomingyourbest.com</span> to coordinate print dimensions and proofs.</Typography>*/}
                    </Box>
                    {/*<Box className="chooseCoverRadioBox">
                      <Box className="FontCoverBox chooseCoverCheckBox">
                        <input id="myCheckbox" type="checkBox"
                          checked={checkboxFront}
                          onChange={handleCheckboxFrontChange}
                        />
                        <Typography ml={2}>upload a front cover</Typography>
                      </Box>
                      <Box className="BackCoverBox chooseCoverCheckBox">
                        <input id="myCheckbox" type="checkBox"
                          checked={checkboxBack}
                          onChange={handleCheckboxBackChange}
                        />
                        <Typography ml={2}>upload a BACK cover</Typography>
                      </Box>
                    </Box>
                    <Box className="frontupload" >
                    {checkboxFront && <>
                          <input
                            onChange={onFrontFileInput}
                            ref={fileFrontInputRef}
                            type="file"
                            className="hidden"
                            multiple
                          />
                          <Box onClick={() => fileFrontInputRef.current.click()} className="chooseFileBtn">
                            <Typography>Choose a Front Cover</Typography>
                          </Box>
                        </>}
                      {checkboxBack && <>
                            <input
                              onChange={onBackFileInput}
                              ref={fileBackInputRef}
                              type="file"
                              className="hidden"
                              
                            />
                            <Box onClick={() => fileBackInputRef.current.click()} className="chooseFileBtn">
                              <Typography>Choose a Back Cover</Typography>
                            </Box>
                            </>
                          }
                        
                        <Box sx={{ display: showCustomCover && frontImage ? "block" : "none" }} onClick={handleCustomCancel} className="chooseFileBtn">
                          <Typography>Cancel Custom Cover</Typography>
                        </Box>
                    </Box>*/}
                    <Box className="chooseCoverRadioBox" sx={{height:'200px', justifyContent:'center'}}>Coming Fall 2024</Box>

                  </Box>
                  <Box  sx={{ display: sessionStorage.getItem("Cover")!=null ? "block" : "none" }} onClick={() => setTab(false)} className="chooseFileBtn">
                    <Typography>Next</Typography>
                  </Box>
                </Box>


              </Box>
              <Box className="RightPanelBox">
                <Box className="RightHeader">
                  <Typography mr={1} className='RightHeaderText'>Step 1:</Typography>
                  <Typography className='RightSubText'>Choose Your Cover</Typography>
                </Box>

                <Box className="PreviewContainer">
                  {!showCustomCover && <>
                    <Box className="viewCoverBox">
                      <img src={coverImage} alt='CoverPhoto' />
                    </Box>
                    <Box className="cover_thumbnails">
                      {coversData.map((cat, index) => (
                        cat?.coverList?.map((cover, coverIndex) => (
                          selectedCoverId === cover.id && (
                            <Box className="CoverItem" key={`cover-${cover.id}`}>
                              {cover?.images?.map((imgObj, imgIndex) => (
                                <img src={imgObj.image} alt="" className={`thumbnail ${coverThumbnail==imgObj.image ? 'active':''}`} key={`img-${imgIndex}`} onClick={()=>{selectCoverThumbnail(imgObj)}} />
                              ))}
                            </Box>
                          )
                        ))
                      ))}
                    </Box>
                  </>}

                  {showCustomCover && <>
                    <Box className="viewCoverBox">
                      <img src={coverPhoto} alt='CoverPhoto' />
                      <Box className="CustomCoverImg">
                        <img src={customCoverPreview} alt='Cover' />
                      </Box>
                    </Box>
                    <Box className="cover_thumbnails">
                      <Box className="CoverItem" >
                        {frontImage && <img src={frontImage} alt="" className={`thumbnail ${coverThumbnail==frontImage ? 'active':''}`}  onClick={()=>{selectCustomThumbnail(frontImage)}} />}
                        {backImage && <img src={backImage} alt="" className={`thumbnail ${coverThumbnail==backImage ? 'active':''}`}  onClick={()=>{selectCustomThumbnail(backImage)}} />}
                      </Box>
                    </Box>
                  </>}
                  
                </Box>


                

              </Box>
  
            </Box>

            {/* CoverBox2 */}
            <Box sx={{ display: tab ? "none" : "flex" }} className="CoverBox2 PageInnerBox ">
              
                <Box className="LeftPanelBox noscroll">
                  <Box className="LeftHeader">
                    <Typography className='LeftTitle'>Fill in the boxes to see what your first page will look like</Typography>
                    <Typography className='LeftSubText'>This will be the first page of your planner and can include your name, email, phone number and a message.</Typography>
                  </Box>

                  <Box className="step2InputFieldBox">
                    <Box mb={2.3} className="st2InputBox">
                      <input type="text" className='st2FullName' placeholder='Full Name' value={name} onChange={(e) =>{ setName(e.target.value);setNameLoad(true);}} required  />
                      {formSubmitted && name==="" && (<Typography className='formerror'>Name is required</Typography>)}
                    </Box>
                    <Box className="st2SecondInputBox">
                      <Box sx={{ width: "48%" }} className="st2InputBox">
                        <input type="text" className='st2email' placeholder='Email (Optional)' value={email}  onChange={(e) =>{ setEmail(e.target.value);setEmailLoad(true);}} />
                      </Box>
                      <Box mb={2} sx={{ width: "48%" }} className="st2InputBox">
                        <input type="text" className='st2Phone' placeholder='Phone (Optional)' value={phone}  onChange={(e) =>{ setPhone(e.target.value); setPhoneLoad(true);}} />
                      </Box>
                    </Box>

                    <Box mb={2} className="st2InputBox">
                      <textarea type="text" className='st2Message' placeholder='Quote or Personal Message (Optional)' onChange={(e) =>{ setMessage(e.target.value); setMessageLoad(true);}} value={message} />
                    </Box>
                    <Box className="st2InputBtn" onClick={handleFirstPage}>
                      <Typography>Save</Typography>
                    </Box>
                  </Box>
                  <Box  sx={{ display: showNext ? "block" : "none" }} onClick={ () => window.location.href  = "/layout" } mt={2} className="st2InputBtn">
                    <Typography>Next</Typography>
                  </Box>
                </Box>

                <Box className="RightPanelBox">
                  <Box className="RightHeader">
                    <Typography mr={1} className='RightHeaderText'>Step 2:</Typography>
                    <Typography className='RightSubText'>Create your first page (fill in the below text fields)</Typography>
                  </Box>
                  <Box mt={3} className="PreviewContainer">
                    <img src={DiaryBaseImage} className='diray_base' alt=""/>
                    <Box className="diray_inner">
                      <Box mr={0.5} className="diray_page st2Page"></Box>
                      <Box ml={0.5} className="diray_page rightpage">
                        <img className='insideCover_binder' src={InsideCoverBinder} alt='InsideCoverBinder' />  
                        <Box className="st2InsideCoverBox">
                          <Box className="st2InsideCoverTextBox">
                            <Typography mb={2} className='date'>{diaryYear}</Typography>
                            <Typography mb={1} className='nameText'> { nameLoad? name.toUpperCase() : "Jane Doe"}</Typography>
                            <Typography mb={1} className='contactText'>{ emailLoad? email : "myemail@gmail.com"}</Typography>
                            <Typography mb={1} className='contactText'>{phoneLoad? phone : "888-888-8888"}</Typography>
                            <Typography mb={1} className='messageText'>{messageLoad? message : "Every day, in every way, I'm getting better and better."}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

            </Box>
          
          
        </Box>
        {<PriceBox nextUrl={handleNextUrl}  updatePriceBox={priceBox} />}
      </Box >
      
       {/* upload popup*/} 
      <UploadPopup 
          showPopup={imagePopup} 
          setShowPopup={setImagePopup} 
          uploadType={imageUploadType} 
          getFrontImage={customFrontImage} 
          getBackImage={customBackImage} 
          setCustomCover={handleCustomCover}  
        />

        
        <ToastContainer autoClose={false} draggable={false} />
    
      <Footer />
    </>
  )
}
