import React, { useState, useEffect } from 'react';
import ImageCropper from "../../Components/ImageCropper";
import FileInput from "../../Components/FileInput";
import "./style.css";
import { Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CropIcon from '@mui/icons-material/Crop';

export default function UploadPopup({showPopup, setShowPopup, uploadType, getFrontImage, getBackImage, setCustomCover}) {

  const [currentUpload, setCurrentUpload] = useState("front");
  const [imageFront, setImageFront] = useState(getFrontImage);
  const [uploadStageFront, setUploadStageFront] = useState("choose-img");
  const [imgAfterCropFront, setImgAfterCropFront] = useState("");

  const [imageBack, setImageBack] = useState(getBackImage);
  const [uploadStageBack, setUploadStageBack] = useState("choose-img");
  const [imgAfterCropBack, setImgAfterCropBack] = useState("");
  const [bleedLine, setBleedLine] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    console.log("Image=>",getFrontImage, getBackImage)
    // Set the parent state in the child component's state
    setImageFront(getFrontImage);
    setUploadStageFront(getFrontImage!=""? "crop-img":"choose-img");
    setImageBack(getBackImage);
    setUploadStageBack(getBackImage!=""? "crop-img":"choose-img");
    
    if(uploadType=="Back"){
      setCurrentUpload("back")
      setImgAfterCropBack("");
    }else{
      setCurrentUpload("front")
      setImgAfterCropFront("");
    }
  }, [getFrontImage, getBackImage,uploadType]);
  

  const handleUploadPopup = ()=>{ 
    setShowPopup(true);
  }
  const handleCustomCover = ()=>{
    setShowPopup(false);
  }
  const handleUploadCancel = ()=>{ 
    onCropCancelFront(); 
    onCropCancelBack();
    setShowPopup(false);
  }


  // Invoked when new image file is selected
  const onImageSelectedFront = (selectedImgFront) => {
    setImageFront(selectedImgFront);
    setUploadStageFront("crop-img");
    
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDoneFront = (imgCroppedArea) => {
  const canvasEle = document.createElement("canvas");
  canvasEle.width = imgCroppedArea.width;
  canvasEle.height = imgCroppedArea.height;

  const context = canvasEle.getContext("2d");

  let imageObj1 = new Image();
  imageObj1.src = imageFront;
  imageObj1.onload = function () {
    context.drawImage(
      imageObj1,
      imgCroppedArea.x,
      imgCroppedArea.y,
      imgCroppedArea.width,
      imgCroppedArea.height,
      0,
      0,
      imgCroppedArea.width,
      imgCroppedArea.height
    );

    const dataURL = canvasEle.toDataURL("image/jpeg");
    //console.log(dataURL);
    setImgAfterCropFront(dataURL);
   // setFrontImage(dataURL);
    setUploadStageFront("img-cropped");
  };
};

// Handle Cancel Button Click
const onCropCancelFront = () => {
  setUploadStageFront("choose-img");
  setImageFront("");
  //setFrontImage("");
};


// Invoked when new image file is selected
const onImageSelectedBack = (selectedImgBack) => {
  setImageBack(selectedImgBack);
  setUploadStageBack("crop-img");
};

// Generating Cropped Image When Done Button Clicked
const onCropDoneBack = (imgCroppedArea2) => {
  const canvasEle2 = document.createElement("canvas");
  canvasEle2.width = imgCroppedArea2.width;
  canvasEle2.height = imgCroppedArea2.height;

  const context2 = canvasEle2.getContext("2d");

  let imageObj2 = new Image();
  imageObj2.src = imageBack;
  imageObj2.onload = function () {
    context2.drawImage(
      imageObj2,
      imgCroppedArea2.x,
      imgCroppedArea2.y,
      imgCroppedArea2.width,
      imgCroppedArea2.height,
      0,
      0,
      imgCroppedArea2.width,
      imgCroppedArea2.height
    );

    const dataURL2 = canvasEle2.toDataURL("image/jpeg");

    setImgAfterCropBack(dataURL2);
    //setBackImage(dataURL2);
    setUploadStageBack("img-cropped");
  };
};

// Handle Cancel Button Click
const onCropCancelBack = () => {
  setUploadStageBack("choose-img");
  setImageBack("");
  //setBackImage("");
};

const handleDuplicate = ()=>{
  if(currentUpload === "front" ){
    setImageBack(imageFront);
    setUploadStageBack("img-cropped");
    setCurrentUpload("back");
  }else{
    setImageFront(imageBack);
    setUploadStageFront("img-cropped");
    setCurrentUpload("front");
  }
}


const handleSave = () =>{
  if(currentUpload === "front" ){
    setCustomCover(currentUpload,imgAfterCropFront);
  }else{
    console.log("CropBack")
    setCustomCover(currentUpload,imgAfterCropBack);
  }
}

   


    return (
      <>
      { showPopup && ( 
        <Box className='coverPopUp UploadPopup'>
          <CancelOutlinedIcon color="action" onClick={() => setShowPopup(false)} className="coverPopUpClose" />

          <Box className="">
            {currentUpload=="front" ? 'Front Cover':'Back Cover'}
          </Box>  
          <Box className="coverPImageBox">
          {currentUpload === "front" ? (
              uploadStageFront === "choose-img" ? (
              <>
                <Box className="uploadFrontElement">
                  <FileInput onImageSelected={onImageSelectedFront} btnTitle="Choose Front Image" />
                </Box>
              </>
              
            ) : uploadStageFront === "crop-img" ? (
              <ImageCropper
                image={imageFront}
                onCropDone={onCropDoneFront}
                onCropCancel={onCropCancelFront}
                bleedLine={bleedLine}
              />
            ) : (
              <Box>
                
               <Box>
                  <img src={imgAfterCropFront} className="cropped-img" alt="" />
                </Box>

              </Box>
            )
          ):(uploadStageBack === "choose-img" ? (
            <>
              <Box className="uploadBackElement">
                <FileInput onImageSelected={onImageSelectedBack} btnTitle="Choose Back Image" />
              </Box>
            </>
            ) : uploadStageBack === "crop-img" ? (
              <ImageCropper
                image={imageBack}
                onCropDone={onCropDoneBack}
                onCropCancel={onCropCancelBack}
                bleedLine={bleedLine}
              />
            ) : (
              <Box>
                
                <Box>
                  <img src={imgAfterCropBack} className="cropped-img" alt="" />
                </Box>

                 {/*<button
                  onClick={() => {
                    setUploadStageBack("crop-img");
                  }}
                  className="btn"
                >
                  Crop
                </button>

                <button sx={{display: (!imageFront)?'flex':'none'}}
                  onClick={() => {
                    setUploadStageBack("choose-img");
                    setImageBack("");
                  }}
                  className="btn"
                >
                  New Image
                </button>*/}
              </Box>
            )
          )}


        <Box className='btnContainer'>

          <Box className="">
            <button
                onClick={() => {
                  setBleedLine(!bleedLine);
                }}
                className={`UploadBtn bleed ${(bleedLine)? 'active':''}`} 
              >
              <Box  className='inner'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.45399 2.30644V0.441406H3.6319V2.30644H12.4663V0.441406H13.6442V2.30644H16V3.48435H13.6442V12.3187H16V13.4966H13.6442V15.558H12.4663V13.6929C12.4663 13.5845 12.3784 13.4966 12.2699 13.4966H3.6319V15.558H2.45399V13.4966H0V12.3187H2.45399V3.48435H0V2.30644H2.45399ZM3.6319 3.48435V12.3187H12.4663V3.48435H3.6319Z" fill="#E7E7EE"></path></svg>
              </Box>
              Bleed Line
            </button>
            {/*<button
                className={`UploadBtn `} 
                onClick={() => {
                  onCropDoneBack();
                }}
              >
              <Box  className='inner'>
              <CropIcon alt="CropIcon" />
              </Box>
              Crop
              </button>*/}

            {((currentUpload=='front' && imgAfterCropFront!="") || (currentUpload=='back' && imgAfterCropBack!="")) ? (<button
                onClick={() => {
                  handleSave();
                }}
                className={`UploadBtn active`} 
              >
              <Box  className='inner'>
              <SaveOutlinedIcon alt="SaveIcon" />
              </Box>
              Save
            </button>):(<button
                className={`UploadBtn `} 
              >
              <Box  className='inner'>
              <SaveOutlinedIcon alt="SaveIcon" />
              </Box>
              Save
            </button>)}
            <button
                onClick={() => {
                  (currentUpload=='front')? onCropCancelFront(): onCropCancelBack();
                }}
                className={`UploadBtn active`} 
              >
              <Box  className='inner'>
              <CloseOutlinedIcon alt="CancelIcon" />
              </Box>
              Cancel
            </button>
            
             
            {/*<button
                onClick={}
                className={`UploadBtn active `} 
              >
              <Box  className='inner'>
              <CancelOutlinedIcon alt="CloseIcon" />
              </Box>
              Close
              </button>*/}
          </Box>
        </Box>

            </Box>
           
        </Box>
        
      )}
      </>
    )

}