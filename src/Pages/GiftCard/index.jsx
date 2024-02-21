import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material'
import "./style.css"
import config from '../../config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import NavBar from '../NavBar'
import Footer from '../Footer'
import { ButtonPrimary } from "../../Components/Buttons"
import ImageViewer from "../../Components/ImageViewer"

const BACKEND_URL = config.BACKEND_URL;


//getting session data


// Regular expression for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GiftCard() {
  const navigate =  useNavigate();
  const location = useLocation();

  var CartData = sessionStorage.getItem("Cart"); 

  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");

  const currentRoute = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get("act");

  const [myUser,setMyUser] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const [giftCardPrice, setGiftCardPrice] = useState("25.00")
  const [giftCardImages, setGiftCardImages] = useState([]); 
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [formValid, setFormValid] = useState(true);


  useEffect(() => {
    if(userSession!=undefined ){
      const userSessionData = JSON.parse(userSession);
      setMyUser(userSessionData);
      setIsLoggedIn(true);
    }

    const fetchGiftCardImages = async () => {
      await axios.get(`${BACKEND_URL}/api/V1/giftcards/`)
        .then( response => {
          const imageArray = response.data.result.giftcards.map(giftcard => giftcard.image);
          setGiftCardImages(imageArray);
         
        })
        .catch(error => {
          console.error('Error fetching gift card data:', error);
        });
    }
    fetchGiftCardImages();

    if(act=="addToCart"){
      addToCart()
    }

  },[]);


  const  addGiftCard= () =>{
    
    if(giftCardPrice!="" && recipientName!="" && recipientEmail!="" && emailRegex.test(recipientEmail) && senderName!="" && senderEmail!="" && emailRegex.test(senderEmail) && giftMessage!="" && deliveryDate!="")
    {
      var CartID = "";
      //console.log("CartData=>",CartData, typeof CartData)
      if(CartData!==null){
        if(typeof CartData=="string"){
          CartData = JSON.parse(CartData)
        }
        CartID = CartData.CartID;
      }
      //console.log("CartID=>",CartID)
 

      // Convert to "YYYY-MM-dd hh:ii:ss" format
      const formattedDate =  dayjs(deliveryDate).format('YYYY-MM-DD HH:mm:ss');



      const GiftCardData  = {
        CartID : CartID,
        price: giftCardPrice,
        recipientName: recipientName,
        recipientEmail: recipientEmail,
        senderName: senderName,
        senderEmail: senderEmail,
        giftMessage: giftMessage,
        deliveryDate: formattedDate
      };
      //console.log("GiftCardData=>",GiftCardData, isLoggedIn)
      sessionStorage.setItem("GiftCard",JSON.stringify(GiftCardData));

      if(!isLoggedIn){
        const currentUrl = currentRoute.replace("/",""); 
        window.location.href=`/login?redirect=${currentUrl}&act=addToCart`;
      }

      addToCart();
    }else{
      setFormValid(false);
    }
  }

  const addToCart = () =>{

    var GiftCardData = sessionStorage.getItem("GiftCard"); 
    if(GiftCardData!=null){
      const ApiHeaders= {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json', // Include this header if needed
      }
  
      const postData = JSON.parse(GiftCardData);
      //console.log("postData=>",postData, ApiHeaders)
      
      axios.post(`${BACKEND_URL}/api/V1/addGiftCard`, postData,{ headers: ApiHeaders } )
        .then(response => {
          if(response.data.status){
            var cart_data={}; 
            //console.log("CartData2=>",CartData)
            if(CartData===null){
              CartData = {CartID:response.data.result.CartID}
            }else{
              //console.log(CartData,response.data.result.CartID )
              if(typeof CartData=="string"){
                CartData = JSON.parse(CartData)
              }
              CartData.CartID = response.data.result.CartID;
            }
            sessionStorage.setItem("Cart", JSON.stringify(CartData))  
            sessionStorage.removeItem("GiftCard") 
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
  }

  const handleDeliveryDate = (date) =>{
    setDeliveryDate(date)
  }
 

  return (
    <>
      <NavBar />
      <Box className="giftCardContainer">
        <Box className="giftCoverBox">
          <ImageViewer images={giftCardImages} />
        </Box>
        <Box className="giftCardInfoBox">
          <Typography className='giftHeader'>Gift Card</Typography>
          <Typography className='giftPriceText'>${giftCardPrice}</Typography>
          <Typography className='giftSubHeader'>Choose amount:</Typography>
          <Box className="giftCardPriceBox">
            <Box onClick={() => setGiftCardPrice("25.00")} className={giftCardPrice === "25.00" ? "giftCardPriceItem giftCardPriceItemActive" : "giftCardPriceItem"}>
              <Typography className={giftCardPrice === "25.00" ? 'giftCardPriceText giftCardPriceTextActive' : "giftCardPriceText"}>$25</Typography>
            </Box>
            <Box onClick={() => setGiftCardPrice("50.00")} className={giftCardPrice === "50.00" ? "giftCardPriceItem giftCardPriceItemActive" : "giftCardPriceItem"}>
              <Typography className={giftCardPrice === "50.00" ? 'giftCardPriceText giftCardPriceTextActive' : "giftCardPriceText"}>$50</Typography>
            </Box>
            <Box onClick={() => setGiftCardPrice("75.00")} className={giftCardPrice === "75.00" ? "giftCardPriceItem giftCardPriceItemActive" : "giftCardPriceItem"}>
              <Typography className={giftCardPrice === "75.00" ? 'giftCardPriceText giftCardPriceTextActive' : "giftCardPriceText"}>$75</Typography>
            </Box>
            <Box onClick={() => setGiftCardPrice("100")} className={giftCardPrice === "100" ? "giftCardPriceItem giftCardPriceItemActive" : "giftCardPriceItem"}>
              <Typography className={giftCardPrice === "100" ? 'giftCardPriceText giftCardPriceTextActive' : "giftCardPriceText"}>$100</Typography>
            </Box>
            <Box onClick={() => setGiftCardPrice("125")} className={giftCardPrice === "125" ? "giftCardPriceItem giftCardPriceItemActive" : "giftCardPriceItem"}>
              <Typography className={giftCardPrice === "125" ? 'giftCardPriceText giftCardPriceTextActive' : "giftCardPriceText"}>$125</Typography>
            </Box>
          </Box>
          {!formValid && giftCardPrice=="" && <Typography className="">Choose the gift card ammount</Typography>}
            
          <TextField className='GiftInput' placeholder='Recipient’s Name' value={recipientName} onChange={(e) =>{ setRecipientName(e.target.value)}} />
          {!formValid && recipientName=="" && <Typography className="">Recipient name is required</Typography>}
          
          <TextField className='GiftInput' placeholder='Recipient’s Email Address' value={recipientEmail} onChange={(e) =>{ setRecipientEmail(e.target.value)}} />
          {!formValid && recipientEmail=="" && <Typography className="">Recipient Email is required</Typography>}
          {!formValid && recipientEmail!="" && !emailRegex.test(recipientEmail) && <Typography className="">Recipient Email is invalid</Typography>}
          
          <TextField className='GiftInput' placeholder='Sender’s Name' value={senderName} onChange={(e) =>{ setSenderName(e.target.value)}}/>
          {!formValid && senderName=="" && <Typography className="">Sender name is required</Typography>}
          
          <TextField className='GiftInput' placeholder='Sender’s Email Address' value={senderEmail} onChange={(e) =>{ setSenderEmail(e.target.value)}}/>
          {!formValid && senderEmail=="" && <Typography className="">Sender email is required</Typography>}
          {!formValid && senderEmail!="" && !emailRegex.test(senderEmail) &&  <Typography className="">Sender email is invalid</Typography>}
          
          <textarea className='messageInput' placeholder='Gift Message' value={giftMessage} onChange={(e) =>{ setGiftMessage(e.target.value)}}/>
          {!formValid && giftMessage=="" && <Typography className="">Gift message is required</Typography>}
          
          {/*<TextField className='GiftInput' placeholder='Delivery Date' value={deliveryDate} onChange={(e) =>{ setDeliveryDate(e.target.value)}}/>*/}
          
          <Box mb={2} className="datePickerBox">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker onChange={handleDeliveryDate} sx={{ width: "100%" }}  value={dayjs(deliveryDate)} />
            </LocalizationProvider>
          </Box>
          {!formValid && deliveryDate=="" && <Typography className="">Delivery date is required</Typography>}

          <ButtonPrimary buttonText="ADD TO CART" width="205px" handelClick={addGiftCard} />
        </Box>

      </Box>

      <ToastContainer autoClose={false} draggable={false} />
    
      <Footer />
    </>
  )
}
