import React, { useState, useEffect, useRef } from 'react'
import { Typography, Box, Slider, LinearProgress } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { toast, ToastContainer } from 'react-toastify';
import ProgressBar from "@ramonak/react-progress-bar";

import "../layout.css";
import "./style.css";
import axios from 'axios';
import config from '../../config';


import rightArrow from "../../Assets/images/rightArrow.png"
import leftArrow from "../../Assets/images/leftArrow.png"

// Flipper images
import FrontCoverPhoto from "../../Assets/images/TopCoverPhoto.png";
import BackCoverPhoto from "../../Assets/images/BackCoverPhoto.png";
import productCover from "../../Assets/images/coverBook.png";

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
  const [coverPdfName, setCoverPdfName] = useState("");
  const [coverPdfPath, setCoverPdfPath] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfPath, setPdfPath] = useState("");
  const [pdfPages, setPdfPages] = useState(0);
  const [minPages, setMinPages] = useState(86);

  const [pageRendered, setPageRendered] = useState(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [frontCover, setFrontCover] = useState(FrontCoverPhoto);
  const [backCover, setBackCover] = useState(BackCoverPhoto);


  const [minPageCountError, setMinPageCountError] = useState(false);
  const [maxPageCountError, setMaxPageCountError] = useState(false);
  const [showGenerating, setShowGenerating] = useState(true);
  const [showDownloading, setShowDownloading] = useState(false);
  const [priceBox, setPriceBox] = useState(1);
  const [menuPopInfo, setMenuPopInfo] = useState(false);
  const [diaryAddinsData, setDiaryAddinsData] = useState([]);

  const BACKEND_URL = config.BACKEND_URL;

  //getting session data
  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");



  var CoverData = sessionStorage.getItem("Cover"); 
  var FirstPageData = sessionStorage.getItem("FirstPage"); 
  var LayoutData = sessionStorage.getItem("Layout"); 
  var CalendarData = sessionStorage.getItem("Calendar"); 
  var AddinsData = sessionStorage.getItem("Addins"); 
  var DatesData = sessionStorage.getItem("Dates"); 
  var PriceData = sessionStorage.getItem("Price"); 
  var ReviewData = sessionStorage.getItem("Review"); 
  var CartData = sessionStorage.getItem("Cart"); 

  var CalendarJsonData = null;
  var AddinsJsonData = null;
  if(CalendarData!=null){
    CalendarJsonData = JSON.parse(CalendarData);
  }
  if(AddinsData!=null){
    AddinsJsonData = JSON.parse(AddinsData);
  }
  

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
      /*else if(CalendarData==null){
        msg="Please select the monthly or year-at-a-glance calender";
        url="/layout#Calendars";
      }
      else if(AddinsData==null){
        msg="Please select addins templates";
        url="/addins";
      }*/
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
       

      if(priceSessionData.pageCount<minPages){
        setMinPageCountError(true);
      }else if(priceSessionData.pageCount>priceSessionData.maxPageCount){
        setMaxPageCountError(true);
      }else{
        
        setShowGenerating(true);  
        
        if(coverSessionData.CoverType=="custom"){
          const formData = new FormData();
          formData.append('Cover', JSON.stringify({CoverType:"Custom"}));
          formData.append('FrontCoverImg', dataURItoBlob(coverSessionData.FrontImage), 'FrontCover.jpg');
          formData.append('BackCoverImg', dataURItoBlob(coverSessionData.BackImage||coverSessionData.FrontImage), 'BackCover.jpg');
          formData.append('Code', Code);
          formData.append('FirstPage', FirstPageData);
          formData.append('Layout', LayoutData);
          formData.append('Calendar', CalendarData);
          formData.append('Addins', AddinsData);
          formData.append('Dates', DatesData);
          //console.log("formData=>",formData);
          axios.post(`${BACKEND_URL}/api/V1/review`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(response => {
              var currentDate = new Date();

              // Get the current time in seconds since the Unix epoch (January 1, 1970)
              var currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
              console.error("Generated PdfPath:",response.data.result.pdfPath);
              setPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfPath+"?time="+currentTimeInSeconds);
              setPdfName(response.data.result.pdfPath);
              setCoverPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfCoverPath+"?time="+currentTimeInSeconds);
              setCoverPdfName(response.data.result.pdfCoverPath);
              setShowGenerating(false);
              setShowDownloading(true);
            })
            .catch(error => {
              console.error('Error fetching in PDF generating:', error);
            });
        }else{

          const postData  = {
            Code : Code,
            Cover : CoverData,
            FirstPage : FirstPageData,
            Layout: LayoutData,
            Calendar: CalendarData,
            Addins: AddinsData,
            Dates: DatesData
          }

          var currentDate = new Date();

          // Get the current time in seconds since the Unix epoch (January 1, 1970)
          var currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
          
          axios.post(`${BACKEND_URL}/api/V1/review`, postData )
            .then(response => {
              console.error("Generated PdfPath:",response.data.result.pdfPath);
              setCoverPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfCoverPath+"?time="+currentTimeInSeconds);
              setCoverPdfName(response.data.result.pdfCoverPath);
              setPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfPath+"?time="+currentTimeInSeconds);
              setPdfName(response.data.result.pdfPath);
              setShowGenerating(false);
              setShowDownloading(true);
              //setFullView(true);
            })
            .catch(error => {
              console.error('Error fetching in PDF generating:', error);
            }); 
            
        }

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

// Helper function to convert base64 to Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: 'image/jpeg' }); // Adjust the MIME type accordingly
}
  
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

      ReviewData = JSON.parse(ReviewData);
        sessionStorage.setItem("Review",JSON.stringify({Code:ReviewData.Code, TermsAgree:true, pdfName:pdfName}));

        if(!isLoggedIn){
          const currentUrl = currentRoute.replace("/",""); 
          window.location.href=`/login?redirect=${currentUrl}&act=addToCart`;
        }

        addToCart();
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

    const ApiHeaders= {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json', // Include this header if needed
    }

    var postCoverData = JSON.parse(CoverData)
    if(postCoverData.CoverType=="custom"){
      postCoverData = {"CoverType":"custom"};
    }

    const postData  = {
      CartID : CartID,
      CoverPdfName: coverPdfName,
      InnerPdfName: pdfName,
      PriceData:JSON.parse(PriceData),
      DiaryData:{
        Cover : postCoverData,
        FirstPage : JSON.parse(FirstPageData),
        Layout: JSON.parse(LayoutData),
        Calendar: JSON.parse(CalendarData),
        Addins: JSON.parse(AddinsData),
        Dates: JSON.parse(DatesData)
      } 
    }
    //console.log("Cart PostData=>",postData)
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
        toast(error,
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
      });
  }

  const calcCompleted = () =>{
    let completed = Math.round((pageRendered / pdfPages) * 100);
    completed = Math.min(completed, 100);
    return completed;
  }

  return (
    <>
      <NavBar />
      
      <Box className="PageContainer Review">
        <Box className={fullView ? 'PageBox fullexpand':'PageBox'}>
          <Box className="PageInnerBox" >
            <Box className={fullView ? "LeftPanelBox" : "LeftPanelBox "}>
              <Box className="LeftHeader">
                <Typography className='LeftTitle'>Your Selections</Typography>
                <Typography className='LeftSubText'>Here is what you’ve added to your planner and the location of those add-ins. Please confirm these look okay:</Typography>
              </Box>
              <Box className="ReviewContainer LeftInner">

                <Box className="cartItemBox">
                  <Box className="cartProductItem" key={`addin-0`} >
                    <Box className="cartProductImg">
                      <Typography>Addins</Typography>
                    </Box>
                    <Box className="cartProductPrice">
                      <Typography>Location</Typography>
                    </Box>
                  </Box>
                  
                  {CalendarJsonData?.yearlyTemplateSelected?.length>0 && CalendarJsonData?.yearlyTemplateSelected?.map((item,index)=>(
                    <Box className="cartProductItem" key={`addin-${index}`} >
                        <Box className="cartProductImg">
                          {/*<img src={item.templateImage} />*/}
                          <Typography>{item.templateTitle}</Typography>
                        </Box>
                        <Box className="cartProductPrice">
                          <Typography>{item.optType}</Typography>
                        </Box>
                    </Box>
                  ))}
                  {CalendarJsonData?.monthlyTemplateSelected?.length>0 && CalendarJsonData?.monthlyTemplateSelected?.map((item,index)=>(
                    <Box className="cartProductItem" key={`addin-${index}`} >
                        <Box className="cartProductImg">
                          {/*<img src={item.templateImage} />*/}
                          <Typography>{item.templateTitle}</Typography>
                        </Box>
                        <Box className="cartProductPrice">
                          <Typography>{item.optType}</Typography>
                        </Box>
                    </Box>
                  ))}
                  {AddinsJsonData!=null && Object.keys(AddinsJsonData).map((categoryKey, index) =>( 
                    
                    AddinsJsonData[categoryKey].length>0 && AddinsJsonData[categoryKey].map((item,index2)=>(
                      <Box className="cartProductItem" key={`${categoryKey}-${index2}`} >
                          <Box className="cartProductImg">

                            <Typography>{item.templateTitle}</Typography>
                          </Box>
                          <Box className="cartProductPrice">
                            <Typography>{item.optType}</Typography>
                          </Box>
                      </Box>
                      ))
                    
                  ))}

                </Box>
                
                

                {CalendarData==null || (CalendarData!=null && CalendarJsonData?.monthlyTemplateSelected.length==0) && <Box className="monthlyInfo">
                  <Typography>You've not selected to add any monthly calendars. If you'd like monthly calendars included, they are in the “Layout” section under the “Calendars” submenu. Thank you!</Typography>
                </Box>}

                <Typography className='confirm-note'>Everything look okay? Let's wrap this up! :)</Typography>
                
                <Box  onClick={handleAddCart} className="chooseFileBtn">
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
                
                <Box className={menuPopInfo? 'PopInfo no-arrow open':'PopInfo'}>
                  <Box className="PopInfo-wrapper">
                    <Typography className="PopInfoClose" onClick={()=>setMenuPopInfo(false)}>X</Typography>
                    <Typography className="PopInfoText">
                    Your planner will print as shown here. Please check and confirm that everything appears correct - the add-ins, the monthly and annual calendars, and your daily or weekly schedule. Once submitted, an order cannot be modified and will be printed as shown, so this is your chance to make sure it is correct. The design bar to the left will also list all of your add-ins and location choices to help you review your selections. Thank you!
                    </Typography>
                  </Box>
                </Box>

                <Box className="PreviewContainer">
                  <Box className="preLoader" sx={{display: pdfLoaded? 'none':'flex'}}>
                    <img src={frontCover} alt='coverpage' />
                    <Box className="LoadingArea" >
                      {minPageCountError && <Typography className='PageCountErrorMsg'>Number of pages must be greater than or equal to 86.</Typography>}
                      {maxPageCountError && <Typography className='PageCountErrorMsg'>Number of pages should not be greater then 242.</Typography>}
                      {!minPageCountError && !maxPageCountError && showGenerating && <Box><Typography className='ReviewMessage'>Generating Preview</Typography><Typography className='ReviewSubtext'>It may take 30-60 seconds to generate the preview</Typography></Box>}
                      {!minPageCountError && !maxPageCountError && showDownloading && <Typography className='ReviewMessage'>Downloading Preview</Typography>}
                      {!minPageCountError && !maxPageCountError && showDownloading && 
                  
                      <ProgressBar 
                        completed={calcCompleted()}
                        bgColor="#b8845f"
                        baseBgColor="#acacab"
                        height="25px"
                        labelAlignment="center"
                        labelColor="#FFF"
                        animateOnRender
                        maxCompleted={100}
                      />
                      }
                      
                    </Box>
                  </Box>
                  {!minPageCountError && !maxPageCountError && <Box className="postLoader" sx={{opacity: pdfLoaded? '1':'0'}}>
                    {pdfPath && <BookFlipper
                      flipBookRef={flipBookRef}
                      pdfUrl={pdfPath}
                      coverImages={pageCovers}
                      onPageFlip={handleSliderPosition}
                      setPdfLoaded={handlePdfLoaded}
                      handleResize={fullView}
                      setPageRender={setPageRendered}
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
