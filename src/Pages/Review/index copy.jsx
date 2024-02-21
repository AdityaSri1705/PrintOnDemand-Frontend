import React, { useState, useEffect, useRef } from 'react'
import { Typography, Box, Slider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { Slider } from '@mui/material-next';
import "../layout.css";
import "./style.css";
import axios from 'axios';
import config from '../../config';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
//import FlipBook from "../../Components/FlipBook"
import { ButtonPrimary } from "../../Components/Buttons"
import PDFViewer from '../../Components/PDFViewer';


export default function Review() {

  const navigate =  useNavigate();
  const flipBookRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [fullView, setFullView] = useState(false);
  const [prevState, setPrevState] = useState(0);
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

  //load api data
  useEffect(() => {

     //getting session data
     var CoverData = sessionStorage.getItem("Cover"); 
     var FirstPageData = sessionStorage.getItem("FirstPage"); 
     var LayoutData = sessionStorage.getItem("Layout"); 
     var CalendarData = sessionStorage.getItem("Calendar"); 
     var AddinsData = sessionStorage.getItem("Addins"); 
     var DatesData = sessionStorage.getItem("Dates"); 
     var priceData = sessionStorage.getItem("Price"); 
    
     const postData  = {
        Cover : CoverData,
        FirstPage : FirstPageData,
        Layout: LayoutData,
        Calendar: CalendarData,
        Addins: AddinsData,
        Dates: DatesData
     }
    
    if(priceData!==null){
      const coverSessionData = JSON.parse(CoverData);
       const priceSessionData = JSON.parse(priceData);
       setPdfPages(priceSessionData.pageCount);
       
    //console.log(priceSessionData.pageCount, priceSessionData.maxPageCount, minPages)
      if(priceSessionData.pageCount<minPages){
        setMinPageCountError(true);
      }else if(priceSessionData.pageCount>priceSessionData.maxPageCount){
        setMaxPageCountError(true);
      }else{
        const BACKEND_URL = config.BACKEND_URL;
        setShowGenerating(true);  
        axios.post(`${BACKEND_URL}/api/V1/review`, postData )
          .then(response => {
            console.error("Generated PdfPath:",response.data.result.pdfPath);
            setPdfPath(BACKEND_URL+"/pdfs/"+response.data.result.pdfPath);
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
     

  }, [ ]);
  
  let currentPage; 
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    detectStateChange(newValue)
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
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




  let Xval;
  let Yval;
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 1000px)').matches) {
        Xval = '480'
        Yval = '280'
      } else if (window.matchMedia('(min-width: 768px)').matches) {
        Xval = '480'
        Yval = '280'
      } else {
        Xval = '480'
        Yval = '280'
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [Xval, Yval]);

  useEffect(() => {
    if (!showGenerating) {
      // After 1 minute, switch to "Downloading Preview"
      const timer = setTimeout(() => {
       
      }, 10000); // 1 minute in milliseconds
     

      return () => {
        // Clear the timer if the component unmounts before the 1-minute delay
        clearTimeout(timer);
      };
    }
  }, [showGenerating]);


  //Flipper images
  const pageCovers = [
    FrontCoverPhoto,
    BackCoverPhoto
  ]


  function detectStateChange(newState) {
    if (newState > prevState) {
      goToNextPage()
    } else if (newState < prevState) {
      goToPreviousPage()
    } else {
      console.log('same ' + newState);
    }
    setPrevState(newState)
  }


  const capturePage = (page) => {
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = await html2canvas(page);
        const imgData = canvas.toDataURL('image/png');
        resolve(imgData);
      } catch (error) {
        reject(error);
      }
    });
  };

  const captureAndDownloadPdf = () => {
      var doc = new jsPDF();

    // Get the HTML content as a string
    var htmlContent = document.getElementById('reviewCover').outerHTML;

    // Add the HTML content to the PDF
    doc.html(htmlContent, {
      callback: function (doc) {
        // Save or display the PDF
        doc.save('output.pdf');
      },
      x: 10,
      y: 10
    });
    doc.save('multi-page-document.pdf');
  }
  
  const handleAddCart = () =>{
    navigate("/cart")
  }

  const pdfUrl = 'http://localhost:3000/output-1.pdf';
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
                      type="checkbox" />
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
                


      {/* <FlipBook   pdfUrl={pdfUrl} />*/}
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
        <PriceBox buttonText="Add to cart" Xval='480' Yval='280' />
        {/* <PriceBox buttonText="Add to cart" Xval={Xval} Yval={Yval} /> */}
      </Box>
      <Footer />
    </>
  )
}
