import React, { useState }  from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


//Components
import Home from "./Pages/Home";
import Login from "./Pages/Home/Login";
import Register from "./Pages/Home/SignUp";
import ForgotPass from "./Pages/Home/ForgotPassword";
import Cover from "./Pages/Cover";
import Layout from "./Pages/Layout";
import Dates from "./Pages/DatesPage";
import Review from "./Pages/Review";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import PaymentForm from "./Pages/PaymentForm";
import OrderSuccess from "./Pages/OrderSuccess";
import PaymentFailed from "./Pages/PaymentFailed";

import MyAccount from "./Pages/MyAccount/AccountInfo";
import MyOrders from "./Pages/MyAccount/MyOrders";
import EditProfile from "./Pages/MyAccount/EditProfile";

import AddIns from "./Pages/Addins";
import Referral from "./Pages/Referral";
import ShareStory from "./Pages/ShareStory";
import GiftCard from "./Pages/GiftCard";

import config from './config';
const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

export default function App() {

const options = {
  // passing the client secret obtained from the server
  clientSecret: config.STRIPE_SECRET_KEY,
};

  
  const [myUser,setMyUser] = useState("");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={ 
            <GoogleOAuthProvider clientId={`${config.GOOGLE_CLIENTID}`}>
              <Login setMyUser={setMyUser}  />
            </GoogleOAuthProvider>
         } />
     
        <Route path="/register" element={ 
            <GoogleOAuthProvider clientId={`${config.GOOGLE_CLIENTID}`}>
                <Register setMyUser={setMyUser} showBox={'register'} />
            </GoogleOAuthProvider> 
          } />

        <Route path="/verify/:token" element={ 
          <GoogleOAuthProvider clientId={`${config.GOOGLE_CLIENTID}`}>
            <Register showBox={'emailverify'} />
          </GoogleOAuthProvider> } />
        <Route path="/forgot-password" element={ <ForgotPass showBox={true} /> } />
        <Route path="/change-password/:token" element={ <ForgotPass showBox={false} /> } />
        <Route path="/cover" element={<Cover />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/addins" element={<AddIns />} />
        <Route path="/dates" element={<Dates />} />
        <Route path="/review" element={<Review />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={
        <Elements stripe={stripePromise} >
          <PaymentForm />
        </Elements>} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<EditProfile />} />

        <Route path="/referral" element={<Referral />} />
        <Route path="/shareStory" element={<ShareStory />} />
        <Route path="/giftCard" element={<GiftCard />} />
      </Routes>
    </>
  );
}
