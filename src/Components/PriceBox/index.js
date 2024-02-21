import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import rightArrow from "../../Assets/images/arrow_forward.svg";




export default function PriceBox({ Xval, Yval, updatePriceBox, buttonText, nextUrl, updatePageCount='' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const NavigateUrls = ['/','/cover','FirstPage','/layout', 'Calendars','/addins','/dates','/review','/cart'];
  const urlIndex = NavigateUrls.indexOf(currentRoute);

  const [x, setX] = useState(window.innerWidth - Xval);
  const [y, setY] = useState(window.innerHeight - Yval);
  const PriceBoxWidth = 309;
  const PriceBoxHeight = 214;


  const today = new Date();
  const endDate = new Date(today); // Clone today's date
  endDate.setDate(today.getDate() + 10); // Calculate the max date = today+10days
  
  
  // Construct the formatted date string
  const maxDateFormat = "";
  const formattedPrice = 0;

  const [pageCount, setPageCount ] = useState("2");
  const [maxPageCount, setMaxPageCount ] = useState("242");
  const [price, setPrice ] = useState(70);
  const [maxDate, setMaxDate ] = useState(endDate);

  const [formatedPrice, setFormatedPrice] = useState("");
  const [formatedMaxDate, setFormatedMaxDate] = useState("");

  const [nextBtnEnable, setNextBtnEnable] = useState(false);
  const [nextBtnUrl, setNextBtnUrl] = useState("");

  var CoverData = JSON.parse(sessionStorage.getItem("Cover")); 
  var FirstPageData = JSON.parse(sessionStorage.getItem("FirstPage")); 
  var LayoutData = JSON.parse(sessionStorage.getItem("Layout"));
  var CalendarData = JSON.parse(sessionStorage.getItem("Calendar")); 
  var AddinsData = JSON.parse(sessionStorage.getItem("Addins")); 
  var DatesData = JSON.parse(sessionStorage.getItem("Dates")); 
  var ReviewData = JSON.parse(sessionStorage.getItem("Review")); 

  const handlePricBoxLocation = () =>{
    var boxCoordinate = JSON.parse(localStorage.getItem("PriceBoxLocation"));
    if(boxCoordinate){
      if(window.innerWidth<boxCoordinate.x){
        setX(window.innerWidth-PriceBoxWidth);
        setY(window.innerHeight-PriceBoxHeight); 
      }else{
        setX(boxCoordinate.x);
        setY(boxCoordinate.y); 
      }

    }else{
      setX(1045)
      setY(438); 
    }
    //console.log(boxCoordinate.x, boxCoordinate.y, window.innerWidth,  window.innerHeight)

  }
  window.addEventListener('resize', handlePricBoxLocation);

  useEffect(() => {
    
    //on page load
    handlePricBoxLocation();
    
    

    var defaultParameters = {
      pageCount: 2,
      maxPageCount: 242,
      price: 70,
      maxDate: endDate
    };

    

    //getting session data
    var priceSessionData = JSON.parse(sessionStorage.getItem("Price")); 
    const mergedData = {  ...defaultParameters, ...priceSessionData  };

    setPageCount(mergedData.pageCount);
    setMaxPageCount(mergedData.maxPageCount);
    setPrice(mergedData.price);
    setMaxDate(mergedData.maxDate);

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
    setFormatedPrice(formattedPrice);

    
    const day = maxDate? maxDate.getDate():"";
    // Format the day with a leading zero if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const month = maxDate? maxDate.toLocaleString('default', { month: 'short' }):"";
    const year = maxDate? maxDate.getFullYear():"";
    setFormatedMaxDate(`${formattedDay} ${month} ${year}`);
    

  },[]);

  
  useEffect(() => {

    const {pagecount, price, maxdate}  = CalculatePriceBoxParemeters();
   
    setPageCount(pagecount);
    if(updatePageCount!="") { 
      updatePageCount(pagecount)
    }
    setPrice(price);
    setMaxDate(maxdate);

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
    setFormatedPrice(formattedPrice);

    
    const day = maxdate? maxdate.getDate():"";
    // Format the day with a leading zero if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const month = maxdate? maxdate.toLocaleString('default', { month: 'short' }):"";
    const year = maxdate? maxdate.getFullYear():"";
    setFormatedMaxDate(`${formattedDay} ${month} ${year}`);

    //set parameters for button url and enable/disable it based on current route and session parameters 
    //it will be use in handleNextPage()
   

    if(currentRoute=="/cover" && CoverData!==undefined && FirstPageData===null){
      setNextBtnEnable(true);
      setNextBtnUrl('FirstPage')
      navigate('/cover#FirstPage')
    }

    if(currentRoute=="/cover" && CoverData!==undefined && FirstPageData!==null){
      setNextBtnEnable(true);
      setNextBtnUrl('/layout')
    }
    if(currentRoute=="/layout" && LayoutData!==undefined  && CalendarData===null){
      setNextBtnEnable(true);
      setNextBtnUrl('Calendars')
      navigate('/layout#Calendars')
    }
    if(currentRoute=="/layout" && LayoutData!==undefined  && CalendarData!==null){
      setNextBtnEnable(true);
      setNextBtnUrl('/addins')
    }
    if(currentRoute=="/addins" && AddinsData!==undefined){
      setNextBtnEnable(true);
      setNextBtnUrl('/dates')
    }
    if(currentRoute=="/dates" && DatesData!==undefined && pagecount<maxPageCount){
      setNextBtnEnable(true);
      setNextBtnUrl('/review')
    }
    if(currentRoute=="/review" && ReviewData!==undefined && ReviewData!==null && ReviewData.TermsAgree==false){
      setNextBtnEnable(false);
      setNextBtnUrl('')
    }
    

    // Check if the "Dates" session item exists in sessionData
    var NewPriceData = sessionStorage.getItem("Price");
    if (NewPriceData!=undefined) {
      var NewPriceData = JSON.parse(NewPriceData);
      // If it exists, update the "startDate" and "endDate"
      NewPriceData['pageCount'] = pagecount;
      NewPriceData['maxPageCount'] = maxPageCount;
      NewPriceData['price'] = price;
      NewPriceData['maxDate'] = maxdate;

      sessionStorage.setItem("Price", JSON.stringify(NewPriceData));
    } else {
      // If it doesn't exist, create a new "Dates" session item
      var PriceData= {pageCount: pagecount, maxPageCount: maxPageCount, price: price, maxDate: maxdate }
      sessionStorage.setItem("Price", JSON.stringify(PriceData));
    }


  },[updatePriceBox])

  function CalculatePriceBoxParemeters () {
      const MaxPages =242;
      const today = new Date();
      var startdate = new Date(today);
      startdate.setDate(today.getDate() + 10);
      var enddate = new Date(startdate);
      var maxdate = new Date(today); // Clone today's date
     
      
      if(DatesData!==null && DatesData.EventDate.endDate!=null && DatesData.EventDate.startDate!=null){
        startdate = new Date(DatesData.EventDate.startDate);
        const start_date = new Date(startdate);
        if(DatesData.EventDate.maxLengthText === "Max length"){
          const end_date = calculateEndDateForPages(start_date, MaxPages, FirstPageData, LayoutData, CalendarData, AddinsData);
          enddate = new Date(end_date);
          maxdate = new Date(enddate);
        }else{
          enddate = new Date(DatesData.EventDate.endDate);
          maxdate = new Date(enddate);
        }
        
      }else{
        //for default Max length
        var extraDays = 0;
        if(LayoutData!==undefined && LayoutData!==null && DatesData!==null && DatesData.EventDate.maxLengthText==="Max length" ){
         
          if(LayoutData.DailySinglePage!==undefined){
            extraDays = (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
          }
          if(LayoutData.DailyTwoPage!==undefined){
            extraDays = 0.5 * (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
          }
          if(LayoutData.WeeklyView!==undefined){
            extraDays = 3.5 * (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
          }

        }else{
          //for default custom date
          if(LayoutData!==undefined && LayoutData!==null && DatesData===null){
            if(LayoutData.DailySinglePage!==undefined) {
              extraDays = 120;
            }
            if(LayoutData.DailyTwoPage!==undefined) {
              extraDays = 75;
            }
            if(LayoutData.WeeklyView!==undefined) {
              extraDays = 365;
            }
          }
        }
     
        //console.log("extraDays3=>",extraDays, startdate, enddate)
        enddate.setDate(startdate.getDate() + extraDays);
        maxdate = new Date(enddate);
      }

      
      const Pages = calculatePages(startdate, enddate, FirstPageData, LayoutData, CalendarData, AddinsData)
      const pagecount = Pages.FirstPages + Pages.EndPages + Pages.LayoutPages + Pages.CalendarPages + Pages.AddinsPages;
      console.log("Price Pages 2:", startdate, enddate, Pages.FirstPages, Pages.EndPages, Pages.LayoutPages, Pages.CalendarPages, Pages.AddinsPages,"=>",pagecount)
      var price =  60 + 0.155 * pagecount;


      return {pagecount, price, maxdate};
  
    }

    /*const calculateEndDateForPages = (sdate, edate, maxpages, FirstPageData, LayoutData, CalendarData, AddinsData) => {
    
      // Initial assumptions
      let startdate = new Date(sdate);
      let enddate = new Date(sdate); // Copy the st
  
      // Recalculate pages using the updated edate
      const Pages = calculatePages(sdate, enddate, FirstPageData, LayoutData, CalendarData, AddinsData);
      console.log("Price Pages =>",Pages)
      var extraDays = 0;
      if(LayoutData.DailySinglePage!==undefined){
        extraDays = (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
      }
      if(LayoutData.DailyTwoPage!==undefined){
        extraDays = 0.5 * (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
      }
      if(LayoutData.WeeklyView!==undefined){
        extraDays = 3.5 * (242 - (Pages.FirstPages + Pages.EndPages + Pages.CalendarPages + Pages.AddinsPages));
      }
      
      // Initial assumptions
      enddate.setDate(startdate.getDate() + extraDays);
      console.log("Price extraDays 2=>",extraDays, startdate, enddate)
      return enddate;
    };*/

    const calculateEndDateForPages = (sdate, maxpages, FirstPageData, LayoutData, CalendarData, AddinsData) => {
      const MS_PER_DAY = 1; // milliseconds per day
    
      // Initial assumptions
      let edate = new Date(sdate.getDate()); // Copy the start date
    
      let currentPages = 0;
    
      while (currentPages < maxpages) {
        // Increment the date by one day
        edate.setDate(edate.getDate() + MS_PER_DAY);
    
        // Recalculate pages using the updated edate
        const pagesData = calculatePages(sdate, edate, FirstPageData, LayoutData, CalendarData, AddinsData);
    
        // Accumulate the pages
        currentPages = pagesData.FirstPages + pagesData.LayoutPages + pagesData.CalendarPages + pagesData.AddinsPages + pagesData.EndPages;
      }
    
      return edate;
    };

    const calculatePages =(sdate, edate, FirstPageData, LayoutData, CalendarData, AddinsData)=>{
      var FirstPages = (FirstPageData!==undefined) ? 1:0;

      var timeDiff = edate - sdate;
      timeDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      //calculating days, weeks, months and quaters
      const Days = Math.round(timeDiff);
      const Weeks = Math.round(timeDiff /  7);
      const Months = Math.round(timeDiff /  30);
      const Quaters = Math.round(timeDiff /  ( 30 * 3));

      var LayoutPages = 0;
      if(LayoutData!==undefined && LayoutData!==null){

        if(LayoutData.DailySinglePage!==undefined) {
          LayoutPages = Days;
          if(Days%2==1) LayoutPages++;
        }
        if(LayoutData.DailyTwoPage!==undefined) LayoutPages = Days*2;
        if(LayoutData.WeeklyView!==undefined) LayoutPages = Weeks*2;
      }
      
      var CalendarPages = 0;
      var onePage = 0;
      var monthPage = 0;
      if(CalendarData!==undefined && CalendarData!==null){
        for (const category in CalendarData) {
          if(category=="yearlyTemplateSelected" || category=="monthlyTemplateSelected")
          {
            const items = CalendarData[category];
            items.forEach(item => {
              if(category=="yearlyTemplateSelected"){
                onePage+=item.count;
              }
              if(category=="monthlyTemplateSelected"){
                monthPage+=item.count;
              }
            });
          }
        }

        //console.log("Calendarpages:", onePage, monthPage)
        onePage = onePage*2;
        monthPage =((monthPage*Months)*2) + 2;
        if(CalendarData['monthlyPlannerRadio']=="246"){
          monthPage += 2*6;   //for 6 months advance calanders
        }
        if(CalendarData['monthlyPlannerRadio']=="247"){
          monthPage += 2*12;   //for 12 months advance calanders
        }
        CalendarPages  = onePage + monthPage;
       // console.log("CalendarTotal:", CalendarPages,"=",onePage, monthPage)
      }

      var AddinsPages = 0;
      var onePage = 0;
      var weekPage = 0;
      var monthPage = 0;
      var quarterPage = 0;
      if(AddinsData!==undefined && AddinsData!==null){
        for (const category in AddinsData) {
          const items = AddinsData[category];
          items.forEach(item => {
            if(item.optType=="Front of Planner" || item.optType=="Back of Planner"){
              onePage+=item.count;
            }
            if(item.optType=="Weekly"){
              weekPage+=item.count;
            }
            if(item.optType=="Monthly"){
              monthPage+=item.count;
            }
            if(item.optType=="Quarterly"){
              quarterPage+=item.count;
            }
          });
        }
       // console.log("AddinPages:", onePage, weekPage, monthPage, quarterPage)
        onePage = onePage*2;
        weekPage = (weekPage*Weeks)*2;
        monthPage =(monthPage*Months)*2;
        quarterPage =(quarterPage*Quaters)*2;
        AddinsPages = onePage + weekPage + monthPage + quarterPage;
        //console.log("AddinTotal:", AddinsPages,"=",onePage, weekPage, monthPage, quarterPage)
      }

      const EndPages = 1;
      //console.log("Pages2=>",FirstPages,EndPages,LayoutPages, CalendarPages, AddinsPages)
      return {FirstPages:FirstPages,EndPages:EndPages,LayoutPages:LayoutPages,CalendarPages:CalendarPages,AddinsPages:AddinsPages};
    }

    function handleMouseDown(e) {
      var offsetX = e.clientX - x;
      var offsetY = e.clientY - y;
     
      //console.log(offsetX, window.innerWidth, PriceBoxWidth)
      //console.log(offsetY, window.innerHeight, PriceBoxHeight)
  
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
  
      function handleMouseMove(e) {
        var xBox = e.clientX - offsetX;
        var yBox = e.clientY - offsetY;
        if( xBox<0){
          xBox = 0
        }
        if( yBox<0){
          yBox = 0
        }
        if( xBox>window.innerWidth-PriceBoxWidth){
          xBox = window.innerWidth-PriceBoxWidth
        }
        if( yBox>window.innerHeight-PriceBoxHeight){
          yBox = window.innerHeight-PriceBoxHeight
        }
        setX(xBox);
        setY(yBox);
      }
  
      function handleMouseUp(e) {
        var xBox = e.clientX - offsetX;
        var yBox = e.clientY - offsetY;
        if( xBox<0){
          xBox = 0
        }
        if( yBox<0){
          yBox = 0
        }
        if( xBox>window.innerWidth-PriceBoxWidth){
          xBox = window.innerWidth-PriceBoxWidth
        }
        if( yBox>window.innerHeight-PriceBoxHeight){
          yBox = window.innerHeight-PriceBoxHeight
        }
        
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        localStorage.setItem('PriceBoxLocation', JSON.stringify({'x':xBox, 'y':yBox}));
      }
    }

    const handleNextPage = () =>{
      if(nextBtnUrl=="FirstPage" && currentRoute=="/cover" && CoverData!==undefined && FirstPageData===null){
        nextUrl("FirstPage");
      }else if(nextBtnUrl=="Calendars" && currentRoute=="/layout" && LayoutData!==undefined  && CalendarData===null){
        nextUrl("Calendars");
      }else if(currentRoute=="/review" && ReviewData!==undefined  && ReviewData!==null){
        nextUrl();
      }else{
        navigate(nextBtnUrl);
      }
    }

  return (
    <>
      <Box
        sx={{ left: x, top: y }}
        onMouseDown={handleMouseDown}
        className="priceHoverBox draggable-popup"
      >
        <Box className="priceInfo">
          <Box className="priceInfo1">
            <Box className="priceInfo1Sub">
              <Typography className="priceInfoText">Page Count</Typography>
              <Typography className="priceInfoBlackText">{pageCount}/{maxPageCount}</Typography>
            </Box>
            <Box className="priceInfo1Sub">
              <Typography className="priceInfoText">Max End Date</Typography>
              <Typography className="priceInfoBlackText">{formatedMaxDate}</Typography>
            </Box>
          </Box>

          <Box className="priceInfo2">
            <Typography className="priceInfo2Text"  mr={1}>Price</Typography>
            <Typography className="priceInfo2PriceText">{formatedPrice}</Typography>
          </Box>
        </Box>
        <Box className={ nextBtnEnable? 'price_nextBtn pointer':'price_nextBtn disabled'} onClick={handleNextPage} >
          <Typography mr={0.5}>{buttonText || "Next"}</Typography>
          <img src={rightArrow} />
        </Box>
      </Box>
    </>
  );
}