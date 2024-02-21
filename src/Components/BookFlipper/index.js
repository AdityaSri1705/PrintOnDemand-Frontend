import React from "react";
import { useCallback, useState, useEffect } from 'react';
import { Typography, Box  } from '@mui/material';
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import "./style.css";

import DiaryBaseImage from "../../Assets/images/diary_base_review.png";
import coverBinderV2 from "../../Assets/images/coverBinder3.png";

import TopCoverImage from "../../Assets/images/TopCoverPhoto.png";
import BackCoverImage from "../../Assets/images/BackCoverPhoto.png";
import EmptyPageImage from "../../Assets/images/EmptyPage.jpg";
import watermarkImage from '../../Assets/images/watermark.png';

function BookFlipper({ flipBookRef, pdfUrl, coverImages, onPageFlip, setPdfLoaded, handleResize, setPageRender }) {

  const [pageIndex, setPageIndex ] = useState(0);
  const [showBinder, setShowBinder ] = useState(false);
  const [innerPages, setInnerPages ] = useState([]);
  const [pdfPageCounts, setPdfPageCounts] = useState(null);
  const [pdfWidth, setPdfWidth ] = useState(0);
  const [pdfHeight, setPdfHeight ] = useState(0);

  const watermark = new Image();
  watermark.src =  watermarkImage;

 

  console.log("PDF Step1")
  useEffect(() => {
    
  var FrontCoverImg = TopCoverImage;
  var BackCoverImg = BackCoverImage;
  var coverData = sessionStorage.getItem("Cover"); 
  if(coverData!==null){
    coverData = JSON.parse(coverData);
    FrontCoverImg = coverData.FrontImage;
    BackCoverImg = coverData.BackImage;
  }


    // Initialize PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.js';
   // PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';

    console.log("PDF Step2")

    const originalWidth = 2250;
    const originalHeight = 3000;
    const desiredWidth = 696;
    const desiredHeight = 936;

    const scaleX = desiredWidth / originalWidth;
    const scaleY = desiredHeight / originalHeight;
    
    // Load and render the PDF
    pdfjsLib.getDocument(pdfUrl)
    .promise
    .then(pdfDocument => {
      const numPages = pdfDocument.numPages;
      
      const pages = [];
      pages.push(FrontCoverImg);
      pages.push(EmptyPageImage);
      console.log("Load FrontCoverImg");
      // Render each page
      const renderPage = (pageNumber) => {
        pdfDocument.getPage(pageNumber)
          .then(page => {
            const canvas = document.createElement('canvas');
            //const viewport = page.getViewport({ scale: Math.min(scaleX, scaleY) });
            const viewport = page.getViewport({ scale: 1.3 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const context = canvas.getContext('2d');


            setPdfWidth(desiredWidth)
            setPdfHeight(desiredHeight)
              
            //console.log("PDF Size=>",width, height, canvas.width, canvas.height, viewport.width, viewport.height,window.innerWidth,window.innerHeight)
            
            page.render({ canvasContext: context, viewport })
              .promise
              .then(async() => {
                /* // Add watermark to the page
                const imgheight = (watermark.height*canvas.width*0.8)/watermark.width;
                context.drawImage(watermark,  canvas.width*0.1, (canvas.height-imgheight)/2, canvas.width*0.8, imgheight);*/
                console.log("PDF Page render=>",pageNumber);
                // initializing the canvas with the original image
                pages.push(canvas.toDataURL());
                setPageRender(pageNumber);
                if (pageNumber === numPages) {

                  // Add BackCoverImg to the end of pages
                  numPages%2==0 && pages.push(EmptyPageImage);
                  pages.push(BackCoverImg);
                  console.log("Load BackCoverImg");

                  // Set the pages in InnerPages state
                  setInnerPages(pages);
                  setPdfPageCounts(numPages);
                  setPdfLoaded(numPages);

                } else {
                  // Render the next page
                  renderPage(pageNumber + 1);
                }
              });
          });
      };

      renderPage(1);
    })
    .catch(error => {
      console.error('Error loading PDF:', error);
    });
     
  }, []);

  useEffect(() => {
    onPageFlip(pageIndex);
    (pageIndex>0 && pageIndex<=pdfPageCounts) ? setShowBinder(true): setShowBinder(false)
    console.log("PDF Step4")
  }, [pageIndex]);

  const handleFlip = useCallback((e) => {
      //console.log('Current page: ' + e.data,pdfPageCounts);
      setPageIndex(e.data)
  }, []);


  return (
    <>

      <Box className="reviewCover" id="FlipBook">
        {showBinder && <img className="coverPhoto" src={DiaryBaseImage} style={{ width: `${pdfWidth}`, height: `${pdfHeight}` }}/>}
        {showBinder && <img className="coverBinder" src={coverBinderV2} id="coverBinder"  />}
          
        {innerPages!==undefined &&  <HTMLFlipBook ref={flipBookRef} width={pdfWidth} height={pdfHeight} showCover={true} autoSize={true} size={'stretch'} onFlip={handleFlip} >
            
          {innerPages?.map((pageDataUrl, index) => (
              <div key={index} data-key={index} className={`demoPage`} data-density={index === 0 || index === innerPages.length - 1 ? 'hard' : ''}  id={`Page-${index}`}>
                <img src={pageDataUrl} alt={`img${index}`} />
              </div>
          ))}
 

        </HTMLFlipBook>}
      </Box>

    </>
  );
}

export default BookFlipper;
