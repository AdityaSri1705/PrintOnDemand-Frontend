import React, { useState } from 'react';
import "./style.css";
import { Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';


//images
import productCover from "../../Assets/images/coverBook.png";
import GiftCardImg from "../../Assets/images/giftcard.jpeg";

export default function CartItem({itemData, setItemQty, deleteItem}) {

  const navigate =  useNavigate();
  const [itemCount, setItemCount] = useState(itemData.quantity)
  const [dropMenu, setDropMenu] = useState(false);

  const handelCountDecrease = () => {
    if (itemCount > 1) {
      setItemCount(itemCount - 1)
      setItemQty(itemData.id, itemCount - 1)
    }
  }
  const handelCountIncrease = () => {
    setItemCount(itemCount + 1)
    setItemQty(itemData.id, itemCount + 1)
  }

  const formatPrice =(price)=>{
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const handleEditItem = () =>{
    navigate("/cover")
  }

  const handleReviewItem = () =>{
    navigate("/review")
  }

  const handleDeleteItem = () =>{
    deleteItem(itemData.id)
  }
  

    return (
      <Box className="cartProductItem" key={`cover-${itemData.id}`} >
        {itemData.type=="Diary" && <Box className="cartProductImg">
          <img src={itemData.cover_id>0? itemData.front_image: productCover} />
          <Typography>{itemData.cover_id>0? itemData.title: "Custom Planner"}</Typography>
        </Box>}

        {itemData.type=="GiftCard" && <Box className="cartProductImg">
          <img src={GiftCardImg}  />
        </Box>}

        <Box className="cartProductCountBtn">
          <svg onClick={handelCountDecrease} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#BC9448" stroke-width="2" />
            <rect x="6" y="10" width="10" height="2" fill="#BC9448" />
          </svg>
          <Typography>{itemCount}</Typography>
          <svg onClick={handelCountIncrease} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#BC9448" stroke-width="2" />
            <path d="M6 10H16V12H6V10Z" fill="#BC9448" />
            <path d="M10 16V6H12V16H10Z" fill="#BC9448" />
          </svg>

        </Box>

        <Box className="cartProductPrice">
          <Typography>{formatPrice(itemData.price)}</Typography>
        </Box>

        <Box className="cartProductTotalPrice cartProductPrice">
          <Typography>{formatPrice(itemData.price * itemCount)}</Typography>

        </Box>
      
        <Box className="cartProductDropBtn" onClick={()=>setDropMenu(!dropMenu)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 10L12.5 14.5L17 10M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" stroke="#BC9448" stroke-width="2" stroke-linecap="round" />
          </svg>
          {dropMenu && <Box className="dropmenu">
              {itemData.type=="Diary" && (<>
              <Box className="dropMenuItem" onClick={handleEditItem}>
                <Typography>Edit</Typography>
              </Box>
              <Box className="dropMenuItem" onClick={handleReviewItem}>
                  <Typography>Review</Typography>
              </Box>
            </>)}
            <Box className="dropMenuItem" onClick={handleDeleteItem}>
                <Typography>Delete</Typography>
            </Box>
          </Box>}
        </Box>
        
      </Box>
    )

}