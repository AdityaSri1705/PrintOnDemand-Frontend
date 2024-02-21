import React, { useState, useRef, useEffect } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import { FileDrop } from 'react-file-drop'
import config from '../../config';
import axios from 'axios';


import coverPhoto from "../../Assets/images/CoverPhoto.png";
import fileDropIcon from "../../Assets/images/cloud_upload.svg";
import InsideCoverBinder from "../../Assets/images/insideCoverBinder.png"


//Component 
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from '../../Components/PriceBox';
import CoverItem from "../../Components/CoverItem"
import UploadPopup from "../../Components/UploadPopup"


export default function Cover() {
  
  const [tab, setTab] = useState(true)
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const [checkboxFront, setCheckboxFront] = useState(false);
  const [checkboxBack, setCheckboxBack] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [coverOption, setCoverOption] = useState("Custom");
  const [coverCategoryData, setCoverCategoryData] = useState([]);
  const [coversData, setCoversData] = useState([]);

  const [coverId, setCoverId] = useState("");
  const [coverImage, setCoverImage] = useState(coverPhoto);
  const [selectedCoverId, setSelectedCoverId] = useState("");
  const [selectedCoverImage, setSelectedCoverImage] = useState("");

  const [coverCustomImage, setCoverCustomImage] = useState({
      front: '',
      back: '',
  });


  const [showFrontUpload, setShowFrontUpload] = useState(true);
  const [imagePopup, setImagePopup] = useState(false);

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

  }, []);


  const handleCheckboxFrontChange = () => {
    setCheckboxFront(!checkboxFront);
  };

  const handleCheckboxBackChange = () => {
    setCheckboxBack(!checkboxBack);
 };


  const onFileInputFront = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes('image')) {
      const reader = new FileReader();
   
      reader.onload = () => {
        setCoverCustomImage({ ...coverCustomImage, front: reader.result });
        console.log(reader.result);
      };

      reader.readAsDataURL(file);
    }

    if(checkboxBack) setShowFrontUpload(false);
    setImagePopup(true);
   
  }
  const onFileInputBack = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes('image')) {
      const reader = new FileReader();

      reader.onload = () => {
        setCoverCustomImage({ ...coverCustomImage, back: reader.result });
        console.log(reader.result);
      };

      reader.readAsDataURL(file);
    }

    setShowFrontUpload(false);
    setImagePopup(true);
  }

  const handleDrop = (e) => {
    e.preventDefault();

    if(showFrontUpload){
      const file = e.dataTransfer.files[0];

      if (file && file.type.includes('image')) {
        const reader = new FileReader();

        reader.onload = () => {
          setCoverCustomImage({ ...coverCustomImage, front: reader.result });
        };

        reader.readAsDataURL(file);
      }
      if(checkboxBack) setShowFrontUpload(false);
      setImagePopup(true);
    }else{
      const file = e.dataTransfer.files[0];

      if (file && file.type.includes('image')) {
        const reader = new FileReader();

        reader.onload = () => {
          setCoverCustomImage({ ...coverCustomImage, back: reader.result });
        };

        reader.readAsDataURL(file);
      }
      setImagePopup(true);
    }
    
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  

  //const onTargetClick = () => {
    //fileInputRef.current.click()
  //}

  const handleCoverChange = (id, img) =>{
    setCoverId(id);
    setCoverImage(img);
  }
  const handleSelectedCover = (id, img)=>{ 
    setSelectedCoverId(id);
    setSelectedCoverImage(img);
  }

  
  


  return (
    <>
      <NavBar />
      <Box className="coverContainer">
        <Box className="coverNav">
          <Box className="CnavItem">
            <Typography className={tab ? "navFont" : null} onClick={() => setTab(true)}>Cover</Typography>
          </Box>
          <Box className="CnavItem">
            <Typography className={tab ? null : "navFont"} onClick={() => setTab(false)}>First Page</Typography>
          </Box>
        </Box>

        <Box className="cover_Box">

          {/* CoverBox1 */}
          <Box sx={{ display: tab ? "flex" : "none" }} className="CoverBox1">
            <Box className="coverOption">
              <Box className="coverHeader">
                <Typography className='coverOptionHeaderText'>Cover Options</Typography>
                <Typography className='coverOptionSubText'>To pick your pattern, select a category and explore....</Typography>
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
                    className={`Box${cat.cat_id}`}
                    key={`cat${index}`} // Use a unique key based on index or cat.cat_id
                  >
                    {cat.coverList.map((cover, coverIndex) => (
                      <>
                      
                      {/*cover item popup*/}
                       <CoverItem key={`${index}-${coverIndex}`} coverData={cover} handleCover={handleCoverChange} handleSelectedCover={handleSelectedCover} selectedCoverId={selectedCoverId} />
                       {/*cover item popup*/}
                     </>
                    ))}
                  </Box>
                ))}

                <Box sx={{ display: coverOption === "Custom" ? "block" : "none" }} className="customBox">
                  <Box className="ChFHeaderBox">
                    <Typography className='chFHeaderText'>Custom Upload</Typography>
                    <Typography className='chFSubText'>Want to upload a corporate or group cover? Please email <span>support@becomingyourbest.com</span> to coordinate print dimensions and proofs.</Typography>
                  </Box>
                  <Box className="chooseCoverRadioBox">
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
                  <Box sx={{display: showFrontUpload? 'block':'none' }} className="frontupload" >
                    <Box  onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="fileDropBox" >
                          <Typography className="uploadTitle"> Front Image</Typography>
                      <input
                        onChange={onFileInputFront}
                        ref={fileInputRefFront}
                        type="file"
                        className="hidden"
                      />

                      <img onClick={() => fileInputRefFront.current.click()} className='fileDropIcon' src={fileDropIcon}  alt='fileDropIcon' />
                      <Typography onClick={() => fileInputRefFront.current.click()} className='fileDropBText'>Drag & Drop</Typography>
                      <Typography onClick={() => fileInputRefFront.current.click()} className='fileDropSubText'>File that contains your events to start uploading...</Typography>

                    </Box>
                    <Box onClick={() => fileInputRefFront.current.click()} className="chooseFileBtn">
                      <Typography>Choose a file</Typography>
                    </Box>
                  </Box>
                  <Box sx={{display: !showFrontUpload? 'block':'none' }} className="Backupload" >
                    <Box onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="fileDropBox" >
                          <Typography className="uploadTitle"> Back Image</Typography>
        
                      <input
                        onChange={onFileInputBack}
                        ref={fileInputRefBack}
                        type="file"
                        className="hidden"
                      />

                      <img onClick={() => fileInputRefBack.current.click()} className='fileDropIcon' src={fileDropIcon}  alt='fileDropIcon' />
                      <Typography onClick={() => fileInputRefBack.current.click()} className='fileDropBText'>Drag & Drop</Typography>
                      <Typography onClick={() => fileInputRefBack.current.click()} className='fileDropSubText'>File that contains your events to start uploading...</Typography>

                    </Box>
                    <Box onClick={() => fileInputRefBack.current.click()} className="chooseFileBtn">
                      <Typography>Choose a file</Typography>
                    </Box>
                  </Box>

                </Box>
              </Box>


            </Box>
            <Box className="chooseCover">
              <Box className="ChooseCoverHeader">
                <Typography mr={1} className='ChooseCoverHeaderText'>Step 1:</Typography>
                <Typography className='ChooseCoverSubText'>Choose Your Cover</Typography>
              </Box>

              <Box className="viewCoverBox">
                <img src={coverImage} alt='CoverPhoto' />
              </Box>


              

            </Box>
 
          </Box>

          {/* CoverBox2 */}
          <Box sx={{ display: tab ? "none" : "block" }} className="CoverBox2">
            <Box className="ChooseCoverHeader">
              <Typography mr={1} className='ChooseCoverHeaderText'>Step 2:</Typography>
              <Typography className='ChooseCoverSubText'>Create your first page (fill in the below text fields)</Typography>
            </Box>

            <Box className="step2Container">

              <Box className="step2InputBox">
                <Box className="step2InputHeaderBox">
                  <Typography className='step2InputHeader'>Fill in the boxes to see what your first page will look like</Typography>
                  <Typography className='step2InputSubHeader'>This will be the first page of your planner and can include your name, email, phone number and a message.</Typography>
                </Box>

                <Box className="step2InputFieldBox">
                  <Box mb={2.3} className="st2InputBox">
                    <input type="text" className='st2FullName' placeholder='Full Name' onChange={(e) => setName(e.target.value)} />
                  </Box>
                  <Box className="st2SecondInputBox">
                    <Box sx={{ width: "48%" }} className="st2InputBox">
                      <input type="text" className='st2email' placeholder='Email (Optional)' onChange={(e) => setEmail(e.target.value)} />
                    </Box>
                    <Box mb={2} sx={{ width: "48%" }} className="st2InputBox">
                      <input type="text" className='st2Phone' placeholder='Phone (Optional)' onChange={(e) => setPhone(e.target.value)} />
                    </Box>
                  </Box>

                  <Box mb={2} className="st2InputBox">
                    <textarea type="text" className='st2Message' placeholder='Quote or Personal Message (Optional)' onChange={(e) => setMessage(e.target.value)} />
                  </Box>
                  <Box className="st2InputBtn">
                    <Typography>Save</Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="st2InsideCoverBox">
                <img className='InsideCoverBinder' src={InsideCoverBinder} alt='InsideCoverBinder' />
                <Box mr={0.5} className="st2InsidePage st2Page"></Box>
                <Box ml={0.5} className="st2InsidePage">
                  <Box className="st2InsideCoverTextBox">
                    <Typography mb={2} className='date'>2023 - 2024</Typography>
                    <Typography mb={1} className='nameText'>{name.toUpperCase() || "TOMMY SHALLENBERGER"}</Typography>
                    <Typography mb={1} className='contactText'>{email || "email@gmail.com"}</Typography>
                    <Typography mb={1} className='contactText'>{phone || "Phone Number"}</Typography>
                    <Typography mb={1} className='messageText'>{message || "Quote or Personal Message"}</Typography>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Box>
          {<PriceBox />}
        </Box>
      </Box >
      
       {/* upload popup*/} 
      <UploadPopup 
          showPopup={imagePopup} 
          setShowPopup={setImagePopup} 
          getCoverImages={coverCustomImage} 
          setCoverImages={setCoverCustomImage}  
          checkboxFront={checkboxBack} 
          checkboxBack={checkboxBack}
        />
      <Footer />
    </>
  )
}
