import React, { useEffect } from 'react';
import pdfjs from 'pdfjs-dist/build/pdf';

import * as pdfjsLib from "pdfjs-dist";
const pdfjsViewer = require("../../../node_modules/pdfjs-dist/web/pdf_viewer.js");
// The workerSrc property shall be specified.
//pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.js';

const PDFViewer = ({ pdfUrl }) => {


  useEffect(() => {
    // Initialize PDF.js
    //pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.js';
    //pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
    // Load and render the PDF

    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    let pageNumber = 1;

    function renderPage(pdfDocument, pageNum) {
    pdfDocument.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
        canvasContext: context,
        viewport: viewport,
        };

        page.render(renderContext).promise.then(() => {
        pageNumber++;
        if (pageNumber <= pdfDocument.numPages) {
            // If there are more pages, continue rendering
            renderPage(pdfDocument, pageNumber);
        }
        }).catch(error => {
        console.error('Error rendering page:', error);
        });
    }).catch(error => {
        console.error('Error getting page:', error);
    });
    }

    pdfjsLib.getDocument('http://localhost:3000/output-1.pdf').promise
        .then(pdfDocument => {
            renderPage(pdfDocument, pageNumber);
     })
      .catch(error => {
        console.error('Error loading PDF:', error);
      });
  }, [pdfUrl]);

  return (
    <div>
      <canvas id="pdfCanvas"></canvas>
    </div>
  );
};

export default PDFViewer;
