import React, { useState, useRef, useEffect } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
//import { FileDrop } from 'react-file-drop'
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
  const fileInputRef = useRef(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear+1;

  const [diaryYear, setDiaryYear] = useState(currentYear+"-"+nextYear);
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


  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  const [imagePopup, setImagePopup] = useState(false);



  useEffect( () => {
    
    const BACKEND_URL = config.BACKEND_URL;
    
    const fetchCoverCategories = async () => {
      await axios.get(`${BACKEND_URL}/api/V1/covers/`)
        .then( response => {
          setCoverCategoryData(response.data.result.categories);
          setCoversData(response.data.result.covers);
          setCoverOption(response.data.result.categories[0].id);
        })
        .catch(error => {
          console.error('Error fetching cover Categories data:', error);
        });
    }
    fetchCoverCategories();

    //load cover data from session on pageload
    var coverData = sessionStorage.getItem("Cover"); 
    if (coverData!== null) {
       coverData = JSON.parse(coverData);
       if(coverData.CoverType==="predesign"){
          setSelectedCoverId(coverData.CoverId);
          setSelectedCoverImage(coverData.FrontImage);
          setCoverImage(coverData.FrontImage);
          setFrontImage("");
          setBackImage("");
       }

    }
     //load cover data from session on pageload
     var FirstPageData = sessionStorage.getItem("FirstPage"); 
     if (FirstPageData!== null) {
      FirstPageData = JSON.parse(FirstPageData);
    
      setDiaryYear(FirstPageData.Year);
      setName(FirstPageData.Name);
      setEmail(FirstPageData.Email); 
      setPhone(FirstPageData.Phone);
      setMessage(FirstPageData.Message);
    }

  }, []);



  const handleCoverChange = (id, front_img, back_img) =>{
    setCoverId(id);
    setCoverImage(front_img);
  }
  const handleSelectedCover = (id, front_img, back_img)=>{ 
    setSelectedCoverId(id);
    setSelectedCoverImage(front_img);
    sessionStorage.setItem("Cover", JSON.stringify({
      CoverType:'predesign', 
      CoverId: id, 
      FrontImage: front_img,
      BackImage: back_img
    }));
  }
  


  
  const handleFirstPage = ()=>{
    sessionStorage.setItem("FirstPage", JSON.stringify({
      Year:diaryYear, 
      Name: (name)? name: 'TOMMY SHALLENBERGER', 
      Email: (email)? email: 'tommy@gmail.com', 
      Phone: (phone)? phone: 'xxx-xxxxx',
      Message: (message)? message: 'Quote or Personal Message'
    }));
    
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

                <Box  sx={{ display: sessionStorage.getItem("Cover")!=null ? "block" : "none" }} onClick={() => setTab(false)} className="chooseFileBtn">
                  <Typography>Next</Typography>
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
            

            <Box className="step2Container">

              <Box className="step2InputBox">
                <Box className="step2InputHeaderBox">
                  <Typography className='step2InputHeader'>Fill in the boxes to see what your first page will look like</Typography>
                  <Typography className='step2InputSubHeader'>This will be the first page of your planner and can include your name, email, phone number and a message.</Typography>
                </Box>

                <Box className="step2InputFieldBox">
                  <Box mb={2.3} className="st2InputBox">
                    <input type="text" className='st2FullName' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />
                  </Box>
                  <Box className="st2SecondInputBox">
                    <Box sx={{ width: "48%" }} className="st2InputBox">
                      <input type="text" className='st2email' placeholder='Email (Optional)' value={email}  onChange={(e) => setEmail(e.target.value)} />
                    </Box>
                    <Box mb={2} sx={{ width: "48%" }} className="st2InputBox">
                      <input type="text" className='st2Phone' placeholder='Phone (Optional)' value={phone}  onChange={(e) => setPhone(e.target.value)} />
                    </Box>
                  </Box>

                  <Box mb={2} className="st2InputBox">
                    <textarea type="text" className='st2Message' placeholder={`"Nothing is impossible. The word itself says, 'I'm possible!'" — Audrey Hepburn`} onChange={(e) => setMessage(e.target.value)} value={message} />
                  </Box>
                  <Box className="st2InputBtn" onClick={handleFirstPage}>
                    <Typography>Save</Typography>
                  </Box>
                </Box>
                <Box  sx={{ display: sessionStorage.getItem("FirstPage")!=null ? "block" : "none" }} onClick={ () => window.location.href  = "/layout" } mt={2} className="st2InputBtn">
                  <Typography>Next</Typography>
                </Box>
              </Box>

              <Box className="st2CoverBox">
                <Box className="ChooseCoverHeader">
                  <Typography mr={1} className='ChooseCoverHeaderText'>Step 2:</Typography>
                  <Typography className='ChooseCoverSubText'>Create your first page (fill in the below text fields)</Typography>
                </Box>
                <Box mt={3} className="step4Container">

                  <Box className="st2InsideCoverBox">
                    <img className='InsideCoverBinder' src={InsideCoverBinder} alt='InsideCoverBinder' />
                    <Box mr={0.5} className="st2InsidePage st2Page"></Box>
                    <Box ml={0.5} className="st2InsidePage">
                      <Box className="st2InsideCoverTextBox">
                        <Typography mb={2} className='date'>{diaryYear}</Typography>
                        <Typography mb={1} className='nameText'>{name.toUpperCase() || "TOMMY SHALLENBERGER"}</Typography>
                        <Typography mb={1} className='contactText'>{email || "tommy@gmail.com"}</Typography>
                        <Typography mb={1} className='contactText'>{phone || "xxx-xxxxx"}</Typography>
                        <Typography mb={1} className='messageText'>{message || `"Nothing is impossible. The word itself says, 'I'm possible!'" — Audrey Hepburn`}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Box>
          {<PriceBox />}
        </Box>
      </Box >
      
       
      <Footer />
    </>
  )
}
