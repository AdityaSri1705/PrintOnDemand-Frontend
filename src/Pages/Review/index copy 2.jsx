import React, { useState, useEffect, useRef } from 'react'
import { Typography, Box, Slider } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { toast, ToastContainer } from 'react-toastify';

import "../layout.css";
import "./style.css";
import axios from 'axios';
import config from '../../config';


import rightArrow from "../../Assets/images/rightArrow.png"
import leftArrow from "../../Assets/images/leftArrow.png"

// Flipper images
import FrontCoverPhoto from "../../Assets/images/Pages/TopCoverPhoto.png";
import BackCoverPhoto from "../../Assets/images/Pages/BackCoverPhoto.png";


// Components
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from '../../Components/PriceBox';
import BookFlipper from "../../Components/BookFlipper"


export default function Review() {

  const navigate =  useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const flipBookRef = useRef(null);

  const [myUser,setMyUser] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [fullView, setFullView] = useState(false);
  const [prevState, setPrevState] = useState(0);
  const [pdfName, setPdfName] = useState("");
  const [pdfPath, setPdfPath] = useState("");
  const [pdfPages, setPdfPages] = useState(0);
  const [minPages, setMinPages] = useState(86);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [frontCover, setFrontCover] = useState(FrontCoverPhoto);
  const [backCover, setBackCover] = useState(BackCoverPhoto);

  const [minPageCountError, setMinPageCountError] = useState(false);
  const [maxPageCountError, setMaxPageCountError] = useState(false);
  const [showGenerating, setShowGenerating] = useState(true);
  const [showDownloading, setShowDownloading] = useState(false);
  const [priceBox, setPriceBox] = useState(1);

  const BACKEND_URL = config.BACKEND_URL;

  //getting session data
  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");
  const ApiHeaders= {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json', // Include this header if needed
  }


  var CoverData = sessionStorage.getItem("Cover"); 
  var FirstPageData = sessionStorage.getItem("FirstPage"); 
  var LayoutData = sessionStorage.getItem("Layout"); 
  var CalendarData = sessionStorage.getItem("Calendar"); 
  var AddinsData = sessionStorage.getItem("Addins"); 
  var DatesData = sessionStorage.getItem("Dates"); 
  var PriceData = sessionStorage.getItem("Price"); 
  var ReviewData = sessionStorage.getItem("Review"); 
  var CartData = sessionStorage.getItem("Cart"); 

  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get("act");

  //load api data
  useEffect(() => {

    
    if(userSession!=undefined ){
      const userSessionData = JSON.parse(userSession);
      setMyUser(userSessionData);
      setIsLoggedIn(true);
    }

    var Code = "";
    if(ReviewData!==undefined && ReviewData!==null ){
       ReviewData = JSON.parse(ReviewData);
       Code = ReviewData.Code; 
    }else{
      Code = generateRandomCode(8);
      sessionStorage.setItem("Review",JSON.stringify({Code:Code, TermsAgree:false}))
    }
    
    if(CoverData==null || FirstPageData==null || LayoutData==null || CalendarData==null || AddinsData==null || DatesData==null){
      var msg = "";  
      var url = "";
      if(CoverData==null){
        msg="Please choose cover to personalize the front page";
        url="/cover";
      }
      else if(FirstPageData==null){
        msg="Please put the first page information";
        url="/cover#FirstPage";
      }
      else if(LayoutData==null){
        msg="Please select the layout";
        url="/layout";
      }
      else if(CalendarData==null){
        msg="Please select the monthly or year-at-a-glance calender";
        url="/layout#Calendars";
      }
      else if(AddinsData==null){
        msg="Please select addins templates";
        url="/addins";
      }
      else if(DatesData==null){
        msg="Please choose the start and end date of diary";
        url="/dates";
      }

      toast(msg,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () =>  navigate(url)
      });

    }else if(PriceData!==null){
      const coverSessionData = JSON.parse(CoverData);
      const priceSessionData = JSON.parse(PriceData);
      setPdfPages(priceSessionData.pageCount);
       
      //console.log(priceSessionData.pageCount, priceSessionData.maxPageCount, minPages)
      if(priceSessionData.pageCount<minPages){
        setMinPageCountError(true);
      }else if(priceSessionData.pageCount>priceSessionData.maxPageCount){
        setMaxPageCountError(true);
      }else{
        
        setShowGenerating(true);  
        
        const postData  = {
          Code : Code,
          Cover : CoverData,
          FirstPage : FirstPageData,
          Layout: LayoutData,
          Calendar: CalendarData,
          Addins: AddinsData,
          Dates: DatesData
        }
        axios.post(`${BACKEND_URL}/api/V1/review`, postData )
          .then(response => {
            console.error("Generated PdfPath:",response.data.result.pdfPath);
            setPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfPath);
            setPdfName(response.data.result.pdfPath);
            setShowGenerating(false);
            setShowDownloading(true);
          })
          .catch(error => {
            console.error('Error fetching in PDF generating:', error);
          }); 
          
          if(coverSessionData){
            setFrontCover(coverSessionData.FrontImage)
            setBackCover(coverSessionData.BackImage)
          } 
      }
        
    }
  

    if(act=="addToCart"){
      addToCart()
    }

  }, [ ]);
  
  const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  };

  let currentPage; 
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
     flipBookRef.current.pageFlip().turnToPage(newValue);
    //detectStateChange()
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
    //ReviewData = JSON.parse(ReviewData);
    //ReviewData.TermsAgree = !isChecked;
    //sessionStorage.setItem("Review",JSON.stringify(ReviewData))
    //setPriceBox(priceBox+1);
  };



  const goToPreviousPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
    setSliderValue((prevValue) => prevValue - 1);
  };

  const goToNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
    setSliderValue((prevValue) => prevValue + 1);
  };

  const handleSliderPosition = (data) =>{
    setSliderValue(parseInt(data));
  }
  const handlePdfLoaded = (numPages)=>{
    console.error("PDF Loaded");
    setPdfPages(numPages);
    setPdfLoaded(true)
    //numPages>0 ? setPdfLoaded(true): setPdfLoaded(false);
  }

  //Flipper images
  const pageCovers = [
    FrontCoverPhoto,
    BackCoverPhoto
  ]


  /*function detectStateChange(newState) {
    if (newState > prevState) {
      goToNextPage()
    } else if (newState < prevState) {
      goToPreviousPage()
    } else {
      console.log('same ' + newState);
    }
    setPrevState(newState)
  }*/

  const handleAddCart = () =>{

    if(showDownloading && pdfName!=""){

      
      if(isChecked){
        ReviewData = JSON.parse(ReviewData);
        sessionStorage.setItem("Review",JSON.stringify({Code:ReviewData.Code, TermsAgree:true, pdfName:pdfName}));

        if(!isLoggedIn){
          const currentUrl = currentRoute.replace("/",""); 
          window.location.href=`/login?redirect=${currentUrl}&act=addToCart`;
        }

        addToCart();

        
      }else{
          toast("Please accept the terms.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      }
    }else{
      toast("Please wait! Preview is still generating..",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
    }
    
  }

  const addToCart = ()=>{
    var CartID = "";
    if(CartData!==null){
      CartData = JSON.parse(CartData);
      CartID = CartData.CartID;
    }

    var ReviewData = JSON.parse(sessionStorage.getItem("Review")); 
    const pdfName = ReviewData.pdfName;
    console.log("Cart ReviewData=>",ReviewData)

    const postData  = {
      CartID : CartID,
      CoverPdfName: '',
      InnerPdfName: pdfName,
      PriceData:JSON.parse(PriceData),
      DiaryData:{
        Cover : JSON.parse(CoverData),
        FirstPage : JSON.parse(FirstPageData),
        Layout: JSON.parse(LayoutData),
        Calendar: JSON.parse(CalendarData),
        Addins: JSON.parse(AddinsData),
        Dates: JSON.parse(DatesData)
      } 
    }
console.log("Cart PostData=>",postData)
    axios.post(`${BACKEND_URL}/api/V1/addCart`, postData,{ headers: ApiHeaders } )
      .then(response => {
        if(response.data.status){
          var cart_data={}; 
          if(CartData===null){
            cart_data = {CartID:response.data.result.CartID}
          }else{
            cart_data = CartData;
            cart_data.CartID = response.data.result.CartID;
          }
          sessionStorage.setItem("Cart", JSON.stringify(cart_data))  
          navigate("/cart")
        }else{
          toast(response.messsage,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });

        }
        
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });
  }


  return (
    <>
      <NavBar />
      <Box className="PageContainer Review">
        <Box className={fullView ? 'PageBox fullexpand':'PageBox'}>
          <Box className="PageInnerBox" >
            <Box className={fullView ? "LeftPanelBox noscroll" : "LeftPanelBox noscroll "}>
              <Box className="LeftHeader">
                <Typography className='LeftTitle'>Review Terms</Typography>
              </Box>
              <Box className="ReviewContainer LeftInner">
               
                  <Box className="reviewHeaderCheck">
                    <input
                      style={{ display: fullView ? "none" : "block" }}
                      onClick={handleCheckboxChange}
                      checked={isChecked}
                      type="checkbox"  />
                    <Typography mb={2} ml={1} className='reviewHeaderText'>BY CHECKING THIS BOX YOU APPROVE THAT YOUR ORDER WILL BE PRINTED AS IT IS SHOWN IN THE PREVIEW </Typography>
                  </Box>
                  <Typography ml={4.8} mb={2}>Please review all pages to ensure:</Typography>
                  <Box ml={4.8}>
                    <ul>
                      <li>The start date and end date are accurate.</li>
                      <li>Your events are imported correctly (day and time).</li>
                      <li>You’re ready for your planner to be printed and shipped. Your order is immediately sent to print upon purchase, so we can’t modify or cancel it once it’s submitted. If you are experiencing issues with the preview, please email </li>
                    </ul>
                    <Link><Typography>support@becomingyourbest.com</Typography></Link>

                    
                  </Box>
                  <Box sx={{ display:  isChecked ? "block" : "none" }} onClick={handleAddCart} className="chooseFileBtn">
                    <Typography>Add To Cart</Typography>
                  </Box>
                  
               
              </Box>

              {fullView ?
                <Box onClick={() => setFullView(false)} className="sideButton">
                  <img src={rightArrow} />
                </Box> :
                <Box onClick={() => setFullView(true)} className="sideButton">
                  <img src={leftArrow} />
                </Box>
              }

            </Box>

            <Box class="RightPanelBox">
                <Box className="RightHeader">
                  <Typography mr={1} className='RightHeaderText'>Step 6:</Typography>
                  <Typography className='RightSubText'>Review</Typography>
                </Box>
              <Box className="customReviewCoverBox">
                


                <Box className="PreviewContainer">
                  <Box className="preLoader" sx={{display: pdfLoaded? 'none':'flex'}}>
                    <img src={frontCover} alt='coverpage' />
                    <Box className="LoadingArea" > 
                      {minPageCountError && <Typography className='PageCountErrorMsg'>Number of pages must be greater than or equal to 86.</Typography>}
                      {maxPageCountError && <Typography className='PageCountErrorMsg'>Number of pages should not be greater then 242.</Typography>}
                      {!minPageCountError && !maxPageCountError && showGenerating && <Box><Typography className='ReviewMessage'>Generating Preview</Typography><Typography className='ReviewSubtext'>It may take 30-60 seconds to generate the preview</Typography></Box>}
                      {!minPageCountError && !maxPageCountError && showDownloading && <Typography className='ReviewMessage'>Downloading Preview</Typography>}
                        
                    </Box>
                  </Box>
                  {!minPageCountError && !maxPageCountError && <Box className="postLoader" sx={{opacity: pdfLoaded? '1':'0'}}>
                    {pdfPath && <BookFlipper
                      flipBookRef={flipBookRef}
                      pdfUrl={pdfPath}
                      coverImages={pageCovers}
                      onPageFlip={handleSliderPosition}
                      setPdfLoaded={handlePdfLoaded}
                      
                    />}
                    </Box>}
                </Box>
                {pdfLoaded && <Box className="slideBox">
                  <KeyboardArrowLeftIcon className='pageArrow' onClick={goToPreviousPage} />
                  <Slider
                    //disabled={isChecked ? false : true}
                    marks
                    max={pdfPages}
                    min={0}
                    size="medium"
                    valueLabelDisplay="auto"
                    value={sliderValue}
                    onChange={handleSliderChange}
                  />
                  <KeyboardArrowRightIcon className='pageArrow' onClick={goToNextPage} />
                  {/*<Typography>Showing Cover{sliderValue}</Typography> */}
                </Box>}
                  
                
                
              </Box>
            </Box>
          </Box>
        </Box>
        <PriceBox buttonText="Add to cart" updatePriceBox={priceBox} nextUrl={handleAddCart}  />
      </Box>
      <Footer />
      <ToastContainer autoClose={false} draggable={false} />
    </>
  )
}
