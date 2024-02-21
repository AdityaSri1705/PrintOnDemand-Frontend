import React, { useState } from "react";
import Cropper from "react-easy-crop";
import './style.css';

import cropIcon from "../../Assets/images/crop-icon.png";
import cropIcon2 from "../../Assets/images/crop_icon.svg";

function ImageCropper({ image, onCropDone, onCropCancel, bleedLine }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 6);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };

  // Handle changes to the crop and zoom values
  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  return (
    <div className="cropper" >
      <div className="crop-container">
        {/* The image you want to crop */}
        <img src={image} alt="Crop" className="crop-image" />

        {/* Add a semi-transparent overlay with a bleed line */}
        <div className={`overlay ${bleedLine ? 'on' : 'off'}`}>
          <div className="bleed-line-horizontal"></div>
          <div className="bleed-line-vertical"></div>
        </div>

        {/* The Cropper component */}
        
        <Cropper
            image={image}
            aspect={aspectRatio}
            crop={crop}
            zoom={zoom}
            onCropComplete={onCropComplete}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
          />
         <button
          className="CropBtn  btn"
          onClick={() => {
            onCropDone(croppedArea);
          }}
        >
          <img src={cropIcon} alt='' />
        </button>
      </div>
      <div className="action-btns">
        {/*<div className="aspect-ratios" onChange={onAspectRatioChange}>
          <input type="radio" value={1 / 1} name="ratio" /> 1:1
          <input type="radio" value={5 / 4} name="ratio" /> 5:4
          <input type="radio" value={4 / 3} name="ratio" /> 4:3
          <input type="radio" value={3 / 2} name="ratio" /> 3:2
          <input type="radio" value={5 / 3} name="ratio" /> 5:3
          <input type="radio" value={16 / 9} name="ratio" /> 16:9
          <input type="radio" value={3 / 1} name="ratio" /> 3:1
        </div>*/}
        
        {/*<button className="bleedline" onClick={handleBleedLine}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.45399 2.30644V0.441406H3.6319V2.30644H12.4663V0.441406H13.6442V2.30644H16V3.48435H13.6442V12.3187H16V13.4966H13.6442V15.558H12.4663V13.6929C12.4663 13.5845 12.3784 13.4966 12.2699 13.4966H3.6319V15.558H2.45399V13.4966H0V12.3187H2.45399V3.48435H0V2.30644H2.45399ZM3.6319 3.48435V12.3187H12.4663V3.48435H3.6319Z" fill="#E7E7EE"></path></svg>
    </button>
        <button className="btn btn-outline" onClick={onCropCancel}>
          Cancel
        </button>*/}
        
       
       
      </div>
    </div>
    
  );
}

export default ImageCropper;
