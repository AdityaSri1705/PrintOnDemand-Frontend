// src/components/FlipBook.js
import React, { useEffect } from 'react';
import $ from 'jquery';
import * as pdfjsLib from "pdfjs-dist";
import 'turn.js';

import coverBinderV2 from "../../Assets/images/coverBinder2.jpg";

const FlipBook = ({pdfUrl}) => {
    console.log("pdfUrl=>",pdfUrl);
    console.log("Running with pdf.js version: " + pdfjsLib.version);
    const pdfa = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
   
  useEffect(() => {
    // Initialize PDF.js
    /*pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
      ).toString();*/
    //pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.js';
   // PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';
   //pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
    console.log("workerSrc=>",pdfjsLib.GlobalWorkerOptions.workerSrc);
    
    
    // Load and render the PDF
    pdfjsLib.getDocument(pdfUrl).promise
     .then(pdfDocument => {
       const numPages = pdfDocument.numPages;
       const pages = [];

       // Render each page
       for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
         pdfDocument.getPage(pageNumber).then(page => {
           const canvas = document.createElement('canvas');
           const viewport = page.getViewport({ scale: 1 });
           const context = canvas.getContext('2d');

           //canvas.height = viewport.height;
           //canvas.width = viewport.width;
           canvas.height = 480;
           canvas.width = 396;

           page.render({ canvasContext: context, viewport }).promise
             .then(() => {
               pages.push(canvas.toDataURL());
               if (pages.length === numPages) {
                 // Initialize the flipbook when all pages are rendered
                 initFlipbook(pages);
               }
             });
         });
       }
     })
     .catch(error => {
       console.error('Error loading PDF:', error);
     });

  }, [pdfUrl]);

  const initFlipbook = (pages) => {
    const flipbookContainer = document.getElementById('flipbook-container');
    pages.forEach((pageDataUrl, index) => {
      const pageElement = document.createElement('div');
      pageElement.className = 'page';
      pageElement.style.backgroundImage = `url(${pageDataUrl})`;
      pageElement.style.zIndex = index;
      flipbookContainer.appendChild(pageElement);
    });

    $(flipbookContainer).turn({
        width: 800,
        height: 480,
      });
    
  };
    
  return (
    <div id="flipbook-container">
       
        {/* Pages will be added here dynamically */}
    </div>
  );
};

export default FlipBook;