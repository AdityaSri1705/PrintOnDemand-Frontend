import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { toast, ToastContainer } from 'react-toastify';

import axios from 'axios';
import config from '../../config';
import "./style.css"
import "../../Pages/Cart/style.css"

//component
import NavBar from '../NavBar';
import Footer from '../Footer';
import { ButtonPrimary } from "../../Components/Buttons"
import { Navigate } from 'react-router-dom';



export default function Checkout() {

  const BACKEND_URL = config.BACKEND_URL;
  const navigate =  useNavigate();
  const CountryList = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
  const StateList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  
  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");
  const ApiHeaders= {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json', // Include this header if needed
  }

  const [coupon, setCoupon] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [houseNo, setHouseNo] = useState("")
  const [street, setStreet] = useState("") 
  const [city, setCity] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [stateDrop, setStateDrop] = useState(false)
  const [stateDropVal, setStateDropVal] = useState("")
  const [countryDrop, setCountryDrop] = useState(false)
  const [countryDropVal, setCountryDropVal] = useState("United States")
  const [cartID, setCartID] = useState("")
  const [cartData, setCartData] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [cartCoupon, setCartCoupon] = useState("");
  const [discountAmt, setDiscountAmt] = useState(0)
  const [tax, setTax] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)
  const [cartSubTotal, setCartSubTotal] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  const [nameError, setNameError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [zipcodeError, setZipcodeError] = useState(false)
  const [stateDropValError, setStateDropValError] = useState(false)
  //sessionStorage.setItem("Cart", JSON.stringify({CartID:24}))
  useEffect(() => {
    
    var CartSessionData = JSON.parse(sessionStorage.getItem("Cart")); 
    if(CartSessionData!==undefined && CartSessionData!==null){
      setCartID(CartSessionData.id);
      

      axios.get(`${BACKEND_URL}/api/V1/getCart/${CartSessionData.CartID}`, { headers: ApiHeaders})
        .then(response => {
          const { Cart, CartItems } = response.data.result;
          setCartData(Cart);
          setCartItems(CartItems);
         
          setCartID(Cart.id);
          setCartSubTotal(Cart.subtotal)
          setCartCoupon(Cart.coupon)
          setDiscountAmt(Cart.discount_amount)
          setTax(Cart.tax)
          setShippingCost(Cart.shipping_cost)
          setCartTotal(Cart.total)

          if(Cart.shipping_name!=""){
            setName(Cart.shipping_name);
            setEmail(Cart.shipping_email);
            setPhone(Cart.shipping_phone);
            setHouseNo(Cart.shipping_houseno);
            setStreet(Cart.shipping_street);
            setCity(Cart.shipping_city);
            setZipcode(Cart.shipping_zipcode);
            setStateDropVal(Cart.shipping_state);
            setCountryDropVal(Cart.shipping_country);
            
            
          }
        })
        .catch(error => {
          console.error('Error fetching layout data:', error);
        });
    }
    
  },[]);

  const handleSaveShippingInfo = () =>{

    if(name==="" || city==="" || stateDropVal==="" || zipcode==="")
    {
      
      console.log("handleSaveShippingInfo=>",name,city,stateDropVal,zipcode)
      if(name==="") setNameError(true); else setNameError(false);
      if(city==="") setCityError(true); else setCityError(false);
      if(stateDropVal==="") setStateDropValError(true); else setStateDropValError(false);
      if(zipcode==="") setZipcodeError(true); else setZipcodeError(false);

      toast("Please fill the required fields",
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
    }else{
      const postData = {
        CartID : cartID,
        shipping_name : name,
        shipping_email : email,
        shipping_phone : phone,
        shipping_houseno : houseNo,
        shipping_street : street,
        shipping_city: city,
        shipping_state: stateDropVal,
        shipping_zipcode : zipcode,
        shipping_country: countryDropVal,
        sub_total: cartSubTotal,
        coupon: cartCoupon,
        discount_amount: discountAmt,
        tax: tax,
        shipping_cost: shippingCost,
        total: cartTotal
      }
      console.log(postData)
      sessionStorage.setItem("Cart", JSON.stringify(postData))
      axios.post(`${BACKEND_URL}/api/V1/updateShippingInfo`, postData, { headers: ApiHeaders})
          .then(response => {
            const { Cart, CartItems, message } = response.data.result;
            setCartData(Cart);
            toast(message,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => {
                  navigate('/payment');
                },
              });
            
          })
          .catch(error => {
            console.error('Error fetching layout data:', error);
          });
    }
  }

  const formatPrice =(price)=>{
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const handleCountry = (e)=>{
    setCountryDrop(false)
    setCountryDropVal(e.target.innerText);
    var shipAmount = 0;
    if(e.target.innerText=="Canada" || e.target.innerText=="Mexico"){
      shipAmount = 20;
    }else if(e.target.innerText=="United States"){
      shipAmount = 0;
    }else{
      shipAmount = 50;
    }
    setShippingCost(shipAmount);
    setCartTotal(cartSubTotal+tax+shipAmount-discountAmt)
  }

  const applyCoupon = ()=>{
    //console.log("CartID=>",cartID);
    axios.get(`${BACKEND_URL}/api/V1/checkCoupon/${cartID}/${coupon}`, { headers: ApiHeaders})
        .then(response => {
          if(response.data.status){
            const { Cart, message } = response.data.result;
            setCartData(Cart);
          
            setCartSubTotal(Cart.subtotal)
            setCartCoupon(Cart.coupon)
            setDiscountAmt(Cart.discount_amount)
            setTax(Cart.tax)
            setShippingCost(Cart.shipping_cost)
            setCartTotal(Cart.total)

            setCoupon("");

            toast(message,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
            });
          }else{
            toast(response.data.errors,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
              });
          }
          

        })
        .catch(error => {
          console.error('Error fetching layout data:', error);
        });
  }

  const removeCoupon = ()=>{
    axios.get(`${BACKEND_URL}/api/V1/removeCoupon/${cartID}`, { headers: ApiHeaders})
        .then(response => {
          const { Cart, message } = response.data.result;
          setCartData(Cart);
        
          setCartSubTotal(Cart.subtotal)
          setCartCoupon(Cart.coupon)
          setDiscountAmt(Cart.discount_amount)
          setTax(Cart.tax)
          setShippingCost(Cart.shipping_cost)
          setCartTotal(Cart.total)

          toast(message,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
          });

        })
        .catch(error => {
          console.error('Error fetching layout data:', error);
        });
  }

  return (
    <>
      <NavBar />
      <Box className="shippingInfoContainer">
        <Box className="cartBox">
          <Box className="cartTopLogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="34" viewBox="0 0 36 34" fill="none">
              <path d="M35.8463 10.2952C35.7241 10.1549 35.5453 10.0741 35.3572 10.0741H32.7858V4.40742C32.7858 4.05971 32.4979 3.77778 32.1429 3.77778H25.2731L23.5327 2.07328C23.2816 1.82749 22.8744 1.82749 22.6237 2.07328L21.8572 2.82405V0.629641C21.8572 0.281937 21.5693 0 21.2143 0H18C17.645 0 17.3571 0.281937 17.3571 0.629641V7.23147L16.2598 8.30626C16.0087 8.55218 16.0087 8.95078 16.2598 9.19676L17.1556 10.0741H12.8571C12.5021 10.0741 12.2143 10.3561 12.2143 10.7038C12.2143 11.0515 12.5021 11.3334 12.8571 11.3334H34.6033L32.2375 25.8149H11.3972L5.75494 8.62215C5.66944 8.36177 5.42208 8.18519 5.14287 8.18519H0.642868C0.28786 8.18519 0 8.46713 0 8.81484C0 9.16254 0.28786 9.44448 0.642868 9.44448H4.67424L10.3165 26.6372C10.402 26.8976 10.6493 27.0741 10.9285 27.0741H32.7857C33.1015 27.0741 33.3706 26.8494 33.4205 26.5439L35.9919 10.8032C36.0216 10.6212 35.9685 10.4355 35.8463 10.2952ZM18.6429 1.25928H20.5715V4.08333L18.6429 5.97226V1.25928ZM27.1827 10.0741H18.9738L17.6235 8.75155L23.0782 3.409L28.5331 8.75155L27.1827 10.0741ZM31.5 10.0741H29.0009L29.8968 9.19676C30.0173 9.07866 30.0851 8.91855 30.0851 8.75155C30.0851 8.58455 30.0173 8.42444 29.8968 8.30633L26.5588 5.03713H31.5V10.0741Z" fill="#B8845F" />
              <path d="M13.5 15.7408C13.145 15.7408 12.8571 16.0227 12.8571 16.3704V20.8225C12.8571 21.1702 13.145 21.4521 13.5 21.4521C13.855 21.4521 14.1429 21.1702 14.1429 20.8225V16.3704C14.1429 16.0227 13.855 15.7408 13.5 15.7408Z" fill="black" />
              <path d="M16.7143 15.7408C16.3593 15.7408 16.0714 16.0227 16.0714 16.3704V20.8225C16.0714 21.1702 16.3593 21.4521 16.7143 21.4521C17.0693 21.4521 17.3571 21.1702 17.3571 20.8225V16.3704C17.3571 16.0227 17.0693 15.7408 16.7143 15.7408Z" fill="black" />
              <path d="M19.9286 15.7408C19.5735 15.7408 19.2857 16.0227 19.2857 16.3704V20.8225C19.2857 21.1702 19.5735 21.4521 19.9286 21.4521C20.2836 21.4521 20.5714 21.1702 20.5714 20.8225V16.3704C20.5714 16.0227 20.2836 15.7408 19.9286 15.7408Z" fill="black" />
              <path d="M23.1428 15.7408C22.7878 15.7408 22.5 16.0227 22.5 16.3704V20.8225C22.5 21.1702 22.7878 21.4521 23.1428 21.4521C23.4978 21.4521 23.7857 21.1702 23.7857 20.8225V16.3704C23.7857 16.0227 23.4979 15.7408 23.1428 15.7408Z" fill="black" />
              <path d="M26.3572 15.7408C26.0022 15.7408 25.7143 16.0227 25.7143 16.3704V20.8225C25.7143 21.1702 26.0022 21.4521 26.3572 21.4521C26.7122 21.4521 27 21.1702 27 20.8225V16.3704C27 16.0227 26.7122 15.7408 26.3572 15.7408Z" fill="black" />
              <path d="M29.5715 15.7408C29.2165 15.7408 28.9286 16.0227 28.9286 16.3704V20.8225C28.9286 21.1702 29.2165 21.4521 29.5715 21.4521C29.9265 21.4521 30.2143 21.1702 30.2143 20.8225V16.3704C30.2143 16.0227 29.9265 15.7408 29.5715 15.7408Z" fill="black" />
              <path d="M15.4286 27.7037C13.6561 27.7037 12.2143 29.116 12.2143 30.8519C12.2143 32.5877 13.6562 34 15.4286 34C17.2009 34 18.6428 32.5877 18.6428 30.8519C18.6429 29.116 17.201 27.7037 15.4286 27.7037ZM15.4286 32.7408C14.3651 32.7408 13.5 31.8934 13.5 30.8519C13.5 29.8103 14.3651 28.9629 15.4286 28.9629C16.492 28.9629 17.3572 29.8103 17.3572 30.8519C17.3572 31.8934 16.492 32.7408 15.4286 32.7408Z" fill="black" />
              <path d="M29.5714 27.7037C27.799 27.7037 26.3572 29.116 26.3572 30.8519C26.3572 32.5877 27.7991 34 29.5714 34C31.3438 34 32.7857 32.5877 32.7857 30.8519C32.7857 29.116 31.3438 27.7037 29.5714 27.7037ZM29.5714 32.7408C28.508 32.7408 27.6428 31.8934 27.6428 30.8519C27.6428 29.8103 28.508 28.9629 29.5714 28.9629C30.6349 28.9629 31.5 29.8103 31.5 30.8519C31.5 31.8934 30.6349 32.7408 29.5714 32.7408Z" fill="black" />
            </svg>
          </Box>

          <Typography className='cartHeader'>Cart</Typography>
          <Typography className='cartHeaderSubtotal'>SHIPPING INFORMATION</Typography>
          <Typography className='cartSubHeader'>Please enter your shipping information below.</Typography>
          <Box className="cartItemBox">
            <Box mb={1.5} className="shipInputBox">
              <TextField className={`Ffour ${nameError? 'required':''}`} placeholder='name' tabIndex='1' value={name} onChange={(e) =>{ setName(e.target.value)}} />
              <TextField className='Ffour' placeholder='Phone' tabIndex='2' value={phone}  onChange={(e) =>{ setPhone(e.target.value)}} />
            </Box>
            <Box mb={1.5} className="shipInputBox">
              <TextField className='stateInput' placeholder='email@email.com' tabIndex='3' value={email}  onChange={(e) =>{ setEmail(e.target.value)}} />
            </Box>
            <Box mb={1.5} className="shipInputBox">
              <TextField className='Ffour' placeholder='Street' tabIndex='4' value={houseNo} onChange={(e) =>{ setHouseNo(e.target.value)}} />
              <TextField className='Ffour' placeholder='Ste, apt, etc' tabIndex='5' value={street} onChange={(e) =>{ setStreet(e.target.value)}} />
            </Box>
            <Box mb={1.5} className="shipInputBox">
              <TextField className={`Ffour ${cityError? 'required':''}`} placeholder='City' tabIndex='6' value={city} onChange={(e) =>{ setCity(e.target.value)}}/>

              <TextField className={`cityInput ${stateDropValError? 'required':''}`} placeholder='State' tabIndex='7' value={stateDropVal} />
          
              {countryDropVal=="United States" && <ArrowDropDownIcon onClick={() => setStateDrop(!stateDrop)} className='cityDropArrow'  />}
              {countryDropVal=="United States" && <Box sx={{ height: stateDrop ? "auto" : "0px" }} className="stateDrop">
                {StateList.map((state)=>(
                  <Box onClick={(e) => {
                    setStateDrop(false)
                    setStateDropVal(e.target.innerText)
                  }} className="stateDropItem">
                    <Typography>{state}</Typography>
                  </Box>
                ))}
              </Box>}

              <TextField className={`cityInput ${zipcodeError? 'required':''}`} placeholder='90001' tabIndex='9' value={zipcode} onChange={(e) =>{ setZipcode(e.target.value)}}/>
    
            </Box>
            <Box mb={1.5} className="shipInputDropBox">
              <TextField className='stateInput' placeholder='Country' tabIndex='10' type='dropDown' value={countryDropVal} />
              <ArrowDropDownIcon onClick={() => setCountryDrop(!countryDrop)} className='StateDropArrow' />
              <Box sx={{ height: countryDrop ? "auto" : "0px" }} className="stateDrop" tabIndex='11'>
                {CountryList.map((country)=>(
                  <Box onClick={handleCountry} className="stateDropItem" >
                    <Typography>{country}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Typography className='cartSubHeader cartSubHeaderShipping'>We are unable to deliver to PO and APO boxes.</Typography>

          <ButtonPrimary buttonText="CONTINUE TO BILLING" handelClick={handleSaveShippingInfo}/>
          <Typography className='cartSubHeader cartSubHeaderShipping'>Planners will print and ships in 10 days.</Typography>
          
          <Box className="paymentSummeryBox">
            <Box className="paymentSummeryItem">
              <Typography className='paymentSummeryText'>SUBTOTAL</Typography>
              <Typography className='paymentSummeryText'>{formatPrice(cartSubTotal)}</Typography>
            </Box>
            {cartCoupon && discountAmt>0 && <Box className="paymentSummeryItem">
              <Typography className='paymentSummeryText'>Discount(Coupon: {cartCoupon})</Typography>
              <Typography className='paymentSummeryText'>{formatPrice(discountAmt)}</Typography>
            </Box>}
            <Box className="paymentSummeryItem">
              <Typography className='paymentSummeryText'>TAX</Typography>
              <Typography className='paymentSummeryText'>{formatPrice(tax)}</Typography>
            </Box>
            <Box className="paymentSummeryItem">
              <Typography className='paymentSummeryText'>SHIPPING</Typography>
              <Typography className='paymentSummeryText'>{formatPrice(shippingCost)}</Typography>
            </Box>
            <Box className="paymentSummeryItem">
              <Typography className='paymentSummeryTotalText'>TOTAL</Typography>
              <Typography className='paymentSummeryTotalText'>{formatPrice(cartTotal)}</Typography>
            </Box>

            {cartCoupon && discountAmt>0 && <Typography className='removeCoupon' onClick={removeCoupon}>Remove Coupon</Typography>}
              
          </Box>

          <Box className="couponCodeBox">
            {!cartCoupon && discountAmt==0 && <>
              <TextField placeholder='Add Coupon Code' value={coupon} onChange={(e) =>{ setCoupon(e.target.value)}}  />
              <Box className="couponButton" onClick={applyCoupon}>
                <Typography>APPLY</Typography>
              </Box>
            </>}
            
          </Box>


        </Box>

      </Box>
      <Footer />
      <ToastContainer autoClose={false} draggable={false} />
    </>
  )
}
