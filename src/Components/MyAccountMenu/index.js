import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';



export default function MyAccount() {
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("MY-ACCOUNT")
    const [sideMenu, setSideMenu] = useState(false)

    return (
        <Box sx={{ width: sideMenu ? "150px" : "0px" }} className="myAccountSideMenu">

            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                    setActiveTab("MY-ACCOUNT")
                    navigate("/myaccount")
                }} className={activeTab === "MY-ACCOUNT" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>MY ACCOUNT</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                setActiveTab("MY-DESIGNS")

                }} className={activeTab === "MY-DESIGNS" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>MY DESIGNS</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                    setActiveTab("ORDERS")
                    navigate("/myorders")
                }}
                className={activeTab === "ORDERS" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>ORDERS</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                    setActiveTab("MY-INFORMATION")
                    navigate("/edit-profile")
                }} className={activeTab === "MY-INFORMATION" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>MY INFORMATION (NAME, ADDRESS, PHONE, EMAIL, PASSWORD)</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                setActiveTab("EMAIL-PREFERENCES")
                }} className={activeTab === "EMAIL-PREFERENCES" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>EMAIL PREFERENCES</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography onClick={() => {
                setActiveTab("REFERRAL-FRIEND")
                navigate("/referral")
                }} className={activeTab === "REFERRAL-FRIEND" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>REFERRAL FRIEND</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography
                onClick={() => {
                    setActiveTab("BECOME-AN-AFFILIATE")
                }}
                className={activeTab === "BECOME-AN-AFFILIATE" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>BECOME AN AFFILIATE</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography
                onClick={() => {
                    setActiveTab("SHARE-YOUR-STORY")
                    navigate("/shareStory")
                }}
                className={activeTab === "SHARE-YOUR-STORY" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>SHARE YOUR STORY</Typography>
            </Box>
            <Box className="myAccountSideMenuItem">
                <Typography
                onClick={() => {
                    setActiveTab("LOGOUT")
                }}
                className={activeTab === "LOGOUT" ? "myAccountSideMenuItemText activeTabText" : "myAccountSideMenuItemText"}>LOGOUT</Typography>
            </Box>

        </Box>
    )
}