import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import config from '../../config';
import 'react-toastify/dist/ReactToastify.css'
import "../layout.css";
import "./style.css";

// icons
import UpArrow from "../../Assets/images/UpArrow.svg";
import DownArrow from "../../Assets/images/DownArrow.svg";
import fileDropIcon from "../../Assets/images/cloud_upload.svg"


//Components
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from "../../Components/PriceBox"
import { ButtonPrimary } from '../../Components/Buttons';

export default function Dates() {

  const navigate  = useNavigate();

  var FirstPageData = JSON.parse(sessionStorage.getItem("FirstPage")); 
  var LayoutData = JSON.parse(sessionStorage.getItem("Layout"));
  var CalendarData = JSON.parse(sessionStorage.getItem("Calendar")); 
  var AddinsData = JSON.parse(sessionStorage.getItem("Addins"));

  const MaxPages = 242;

  const [priceBox, setPriceBox] = useState(1);
  const [pages, setPages] = useState([]);

  const [holidayList, setHolidayList] = useState([]);
  const [holidayDates, setHolidayDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});

  const [startEndDrop, setStartEndDrop] = useState(true)
  const [presetsEventsDrop, setPresetsEventsDrop] = useState(false)


  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [startDayDrop, setStartDayDrop] = useState(false)
  const [startDayText, setStartDayText] = useState("Sunday Start")

  const [maxLengthDrop, setMaxLengthyDrop] = useState(false)
  const [maxLengthText, setMaxLengthText] = useState("")

  const firstShow = 1;
  const [parentCheckboxes, setParentCheckboxes] = useState({});
  const [childCheckboxes, setChildCheckboxes] = useState({});
  const [allDateCheckboxes, setAllDateCheckboxes] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [pageCountError, setPageCountError] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(`${date.$d}`);
    updateDiaryYear(`${date.$d}`, endDate);
    
    // Check if the "Dates" session item exists in sessionData
    var NewSessionData = sessionStorage.getItem("Dates");
    if (NewSessionData!=undefined) {
      var NewSessionData = JSON.parse(NewSessionData);
      // If it exists, update the "startDate" and "endDate"
      NewSessionData['EventDate'] = {startDayText: startDayText, startDate: startDate, endDate:endDate, maxLengthText:maxLengthText }; 
      NewSessionData['presentEvent'] = {parentCheckboxes:parentCheckboxes, childCheckboxes:childCheckboxes, selectedDates: selectedDates}
      sessionStorage.setItem("Dates", JSON.stringify(NewSessionData));
    } else {
      // If it doesn't exist, create a new "Dates" session item
      var dates= {
        EventDate:{startDayText: startDayText, startDate: startDate, endDate:endDate, maxLengthText:maxLengthText },
        presentEvent:{parentCheckboxes:[], childCheckboxes:[], selectedDates: []}
       };
      sessionStorage.setItem("Dates", JSON.stringify(dates));
    }
    
  };

  
  const handleEndDateChange = (date) => {
    setMaxLengthText("Custom")
    setEndDate(`${date.$d}`);
    updateDiaryYear(startDate, `${date.$d}`);
    updateDateSession();
    
    
  }

  const updateDiaryYear = (sdate,edate)=>{
    var FirstPageData = sessionStorage.getItem("FirstPage");
    FirstPageData = JSON.parse(FirstPageData);
    const sdate1 = new Date(sdate);
    const edate1 = new Date(edate);

    var diary_year = sdate1.getFullYear();
    if(sdate1.getFullYear()!==edate1.getFullYear()){
      diary_year = sdate1.getFullYear()+" - "+ edate1.getFullYear()
    }
    if(FirstPageData!==null){
      
      FirstPageData['Year'] = diary_year;
    }
    
    //update years on first page
    sessionStorage.setItem("FirstPage", JSON.stringify(FirstPageData));
  }
  //load api data
  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;

    axios.get(`${BACKEND_URL}/api/V1/holiday-dates`)
      .then(response => {
        const { holidayList, holidayDates } = response.data.result;
        setHolidayList(holidayList);
        setHolidayDates(holidayDates);
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });

      

  }, [ ]);

  //load data in session
  useEffect(() => { 
    
    const today = new Date();
    const startdate = new Date(today); // Clone today's date
    
     // Clone today's date
     //default value of the start date
    startdate.setDate(today.getDate() + 10);
    var enddate = new Date(startdate);

    //default value of the end date
    if(LayoutData!==undefined && LayoutData!==null){
      if(LayoutData.DailySinglePage!==undefined){
        enddate.setDate(startdate.getDate() + 120);
      } 
      if(LayoutData.DailyTwoPage!==undefined){
        enddate.setDate(startdate.getDate() + 75);
      } 
      if(LayoutData.WeeklyView!==undefined){
        enddate.setDate(startdate.getDate() + 365);
      } 
    }
    
    

    var defaultParameters = {
      EventDate:  {startDayText: "Sunday Start", startDate: startdate, endDate:enddate, maxLengthText:"Custom" },
      presentEvent: {parentCheckboxes: "National-Holidays", childCheckboxes:4, selectedDates: []}
    };
   
    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Dates")); 

    // Merge default parameters with session data
    const mergedData = {  ...defaultParameters, ...sessionData };

    setStartDayText(mergedData.EventDate.startDayText);
    setStartDate(new Date(mergedData.EventDate.startDate));
    setEndDate(new Date(mergedData.EventDate.endDate));
    setMaxLengthText(mergedData.EventDate.maxLengthText);
    setParentCheckboxes(mergedData.presentEvent.parentCheckboxes);
    setChildCheckboxes(mergedData.presentEvent.childCheckboxes);
    setSelectedDates(mergedData.presentEvent.selectedDates);

    
    
    if(sessionData!==undefined && sessionData!==null){
      
      if(sessionData.EventDate.maxLengthText === "Max length"){
        const startdate = new Date(sessionData.EventDate.startDate);
        enddate = calculateEndDateForPages(startdate, MaxPages, FirstPageData, LayoutData, CalendarData, AddinsData);
        setEndDate(enddate);
       
      }
    }

  }, []);

  
  useEffect(() => { 
    updateDateSession();
  },[startDayText,startDate, endDate, maxLengthText, parentCheckboxes, childCheckboxes, selectedDates]);


  const updateDateSession = () =>{
    // Check if the "Dates" session item exists in sessionData
    var NewSessionData = sessionStorage.getItem("Dates");
    if (NewSessionData!=undefined) {
      var NewSessionData = JSON.parse(NewSessionData);
      // If it exists, update the "startDate" and "endDate"
      NewSessionData['EventDate'] = {startDayText: startDayText, startDate: startDate, endDate:endDate, maxLengthText:maxLengthText }; 
      NewSessionData['presentEvent'] = {parentCheckboxes:parentCheckboxes, childCheckboxes:childCheckboxes, selectedDates: selectedDates}
      sessionStorage.setItem("Dates", JSON.stringify(NewSessionData));
    } else {
      // If it doesn't exist, create a new "Dates" session item
      var dates= {
        EventDate:{startDayText: startDayText, startDate: startDate, endDate:endDate, maxLengthText:maxLengthText },
        presentEvent:{parentCheckboxes:parentCheckboxes, childCheckboxes:childCheckboxes, selectedDates: selectedDates}
       };
      sessionStorage.setItem("Dates", JSON.stringify(dates));
    }

    setPriceBox(priceBox+1)
  }


  //save data in session
  const handleSaveDates = () => { 
    

    updateDateSession();

    toast("Selected Dates have stored",
     {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () =>  navigate('/review')
    
    });
   
  }

  const handleNextUrl = () =>{
    navigate('/review')
  }

  const handleHolidayDay = (holiday) => {
    const updatedParentCheckboxes = { ...parentCheckboxes };
    updatedParentCheckboxes[holiday] = !parentCheckboxes[holiday];
    setParentCheckboxes(updatedParentCheckboxes);

    const updatedChildCheckboxes = { ...childCheckboxes };
    for (const subHoliday of holidayList[holiday]) {
      updatedChildCheckboxes[subHoliday.id] = updatedParentCheckboxes[holiday];
    }
    setChildCheckboxes(updatedChildCheckboxes);
  };

  const handleHolidaySubDay = (hdayId) => {
    const updatedChildCheckboxes = { ...childCheckboxes };
    updatedChildCheckboxes[hdayId] = !childCheckboxes[hdayId];
    setChildCheckboxes(updatedChildCheckboxes);

    // If all child checkboxes are checked, update the parent checkbox
    const parentHoliday = Object.keys(holidayList).find((holiday) => {
      return holidayList[holiday].every((subHoliday) => updatedChildCheckboxes[subHoliday.id]);
    });
    if (parentHoliday) {
      const updatedParentCheckboxes = { ...parentCheckboxes };
      updatedParentCheckboxes[parentHoliday] = true;
      setParentCheckboxes(updatedParentCheckboxes);
    }
  };

  const handleAllSelectDate = (hdayId) => {
    const updatedAllSelectCheckboxes = { ...allDateCheckboxes };
    updatedAllSelectCheckboxes[hdayId] = !allDateCheckboxes[hdayId];
    setAllDateCheckboxes(updatedAllSelectCheckboxes);

    const updatedSelectedDates = { ...selectedDates };
    for (const hdate of holidayDates[hdayId]) {
      updatedSelectedDates[hdate.id] = updatedAllSelectCheckboxes[hdayId];
    }
    setSelectedDates(updatedSelectedDates);
  };

  const handleHolidayDate = (hdateId) => {
    const updatedSelectedDates = { ...selectedDates };
    updatedSelectedDates[hdateId] = !selectedDates[hdateId];
    setSelectedDates(updatedSelectedDates);
  };

  const countCheckedSubHoliday = ()=>{
    let trueCount = 0;
    if(childCheckboxes!==null){
      for (const key in childCheckboxes) {
        if (childCheckboxes[key] === true) {
          trueCount++;
        }
      }
    }
    return trueCount;
  }

  const countTotalDates = (hdateId)=>{
    let trueCount = 0;
    if(holidayDates!==null &&  holidayDates[hdateId]!==undefined){
      trueCount = holidayDates[hdateId].length
    }
    return trueCount;
  }

  const countCheckedDates = (hdateId)=>{
    let trueCount = 0;

    if(holidayDates!==null &&  holidayDates[hdateId]!==undefined){
      holidayDates[hdateId].forEach((hdate, index) => {
        if (selectedDates!==null && selectedDates[hdate.id] === true) {
          trueCount++;
        }
      });
    }

    return trueCount;
  }

  const handleMaxDays = (optText)=>{
    setMaxLengthText(optText);
    const start_date = new Date(startDate);
    if(optText === "Max length"){
      const end_date = calculateEndDateForPages(startDate, MaxPages, FirstPageData, LayoutData, CalendarData, AddinsData);
      setEndDate(end_date);
    }
    
    
    updateDateSession();
    
  }

  const handleCustomDay = (optText) =>{
    setMaxLengthText(optText);
    const start_date = new Date(startDate);
    var end_date = new Date(startDate);
    if(optText === "Custom"){
      //let Pages = calculatePages(start_date, end_date, FirstPageData, LayoutData, CalendarData, AddinsData)
    
      if(LayoutData!==undefined && LayoutData!==null ){
        var extraDays = 75;
        if(LayoutData.DailySinglePage!==undefined) {
          extraDays = 120;
        }
        if(LayoutData.DailyTwoPage!==undefined) {
          extraDays = 75;
        }
        if(LayoutData.WeeklyView!==undefined) {
          extraDays = 365;
        }
       
        end_date.setDate(start_date.getDate() + extraDays);

      }
    }

    setEndDate(end_date);
    updateDateSession();
  }

  const calculateEndDateForPages = (sdate, maxpages, FirstPageData, LayoutData, CalendarData, AddinsData) => {
    const MS_PER_DAY = 24 * 60 * 60 * 1000; // milliseconds per day
  
    // Initial assumptions
    let edate = new Date(sdate.getTime()); // Copy the start date
  
    let currentPages = 0;
  
    while (currentPages < maxpages) {
      // Increment the date by one day
      edate.setTime(edate.getTime() + MS_PER_DAY);
  
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
              if(item.optType=="Front of Planner" || item.optType=="Back of Planner"){
                onePage+=item.count;
              }
              if(item.optType=="Monthly"){
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
      return {FirstPages:FirstPages,EndPages:EndPages,LayoutPages:LayoutPages,CalendarPages:CalendarPages,AddinsPages:AddinsPages};
  }


  const HolidayBox = (hday)=>{
    return (
      <>
        <Box className="eventHeaderBox">
        <Typography className='presetsEventsHeader'>{hday.title}</Typography>
        <Typography className='checkBoxSubText'>To remove any holidays from your planner, simply uncheck</Typography>
        </Box>
        <Box mt={2} className="presetsEventsBox">
          <Box>
            <Box className="checkBoxItem">
              <input type="checkbox" key={`checkdate-${hday.id}`} 
                        value={hday.id} 
                        checked={allDateCheckboxes[hday.id] || false}
                        onChange={() => handleAllSelectDate(hday.id)} />
              <Typography className='checkBoxSubText' ml={1}>SELECT ALL</Typography>
            </Box>
            {holidayDates[hday.id]!==undefined && holidayDates[hday.id].map((hdate,index) => {
              return (
                <Box className="checkBoxItem">
                   <input type="checkbox" 
                        key={`checkdate-${hdate.id}`} 
                        value={hdate.id} 
                        checked={selectedDates[hdate.id] || false}
                        onChange={() => handleHolidayDate(hdate.id)} />
                  <Typography className='checkBoxSubText' ml={1}>{hdate.title}</Typography>
                </Box>
              )
              })}
          </Box>
        </Box>
      </>
    )
  }

  const handlePageCount = (pcount) =>{
    setPageCount(pcount)
    if(pcount>242){
      setPageCountError(true);
    }else{
      setPageCountError(false);
    }
  }

  return (
    <>
      <NavBar />
      <Box className="PageContainer">
        <Box className="PageBox">
          <Box className="PageInnerBox">
            <Box className="LeftPanelBox noscroll">
              <Box className="LeftHeader">
                <Typography className='LeftTitle'>Choose Dates And Holidays</Typography>
              </Box>
              {/* Start End Drop */}
              <Box sx={{ height: startEndDrop ? "auto" : "62px" }} mb={2.5} className={maxLengthDrop? "StartEndDrop datesDrop2":"StartEndDrop datesDrop"}>
                <Box mb={2} onClick={() => {
                  setStartEndDrop(!startEndDrop)
                  setPresetsEventsDrop(false)
                }} className="StartEndDropHeader">
                  <Typography className="dropBoxHeader" sx={{ color: startEndDrop ? "#1e1d1d" : "#8E8E8E" }}>Start and End Date</Typography>
                  <img className="dropBoxNavigateArrow startNavigateArrow" src={startEndDrop ? UpArrow : DownArrow} />
                </Box>
                <Box className="DropInnerContainer">
                  <Typography mb={2} className='dropBoxSubHeader'>
                    Please choose a Monday or Sunday start for<br /> your monthly-view calendars.
                  </Typography>

                  <Box mb={2} onClick={() => setStartDayDrop(!startDayDrop)} className="innerDrop">
                    <Typography className='innerDropText'>{startDayText || "Sunday Start"}</Typography>
                    <img className="dropBoxNavigateArrow" src={startDayDrop ? UpArrow : DownArrow} />
                    <Box sx={{ height: startDayDrop ? "auto" : "0px" }} className="innerDropItemBox">
                      <Box onClick={(e) => setStartDayText(e.target.innerText)} className="innerDropItem">
                        <p>Monday Start</p>
                      </Box>
                      <Box onClick={(e) => setStartDayText(e.target.innerText)} className="innerDropItem">
                        <p>Sunday Start</p>
                      </Box>
                    </Box>
                  </Box>

                  <Typography className='dropBoxHeader'>Choose the start date for your planner</Typography>
                  <Typography mb={1} className='subText'>(please remember it will take up to 10 days to print and ship your planner)</Typography>
                  <Box mb={2} className="datePickerBox">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker onChange={handleStartDateChange} sx={{ width: "100%" }}  value={dayjs(startDate)} />
                    </LocalizationProvider>
                  </Box>

                  <Typography mb={1.5} className='dropBoxHeader'>How far out do you want your planner to go?</Typography>

                  <Box mb={2} onClick={() => setMaxLengthyDrop(!maxLengthDrop)} className="innerDrop">
                    <Typography className='innerDropText'>{maxLengthText || "Max length"}</Typography>
                    <img className="dropBoxNavigateArrow" src={maxLengthDrop ? UpArrow : DownArrow} />
                    <Box sx={{ height: maxLengthDrop ? "auto" : "0px" }} className="innerDropItemBox">
                      <Box onClick={(e) => handleMaxDays(e.target.innerText)} className="innerDropItem">
                        <p>Max length</p>
                      </Box>
                      <Box onClick={(e) => handleCustomDay(e.target.innerText)} className="innerDropItem">
                        <p>Custom</p>
                      </Box>
                    </Box>
                  </Box>

                  <Typography mb={1.5} className='dropBoxHeader'>Choose the End date for your planner </Typography>
                  <Box className="datePickerBox">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker onChange={handleEndDateChange} sx={{ width: "100%" }}  value={dayjs(endDate)}  />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </Box>

              {/* presets Events Drop */}
              <Box mb={2.5} sx={{ height: presetsEventsDrop ? "auto" : "62px" }} className="presetsDrop datesDrop">
                <Box mb={2} onClick={() => {
                  setPresetsEventsDrop(!presetsEventsDrop)
                  setStartEndDrop(false)
                }} className="StartEndDropHeader">
                  <Typography className="dropBoxHeader" sx={{ color: presetsEventsDrop ? "#1e1d1d" : "#8E8E8E" }}>Presets Events</Typography>
                  <img className="dropBoxNavigateArrow startNavigateArrow" src={presetsEventsDrop ? UpArrow : DownArrow} />
                </Box>
                <Box mt={0.5} className="DropInnerContainer">


                    {Object.keys(holidayList).map((holiday,index) => {
                      return (
                        <Box mb={1.5} className="checkBoxContainer">
                          <Box className="checkBoxItem">

                            <input type="checkbox" 
                            key={`pcheck-${index}`} 
                            value={holiday} 
                            checked={parentCheckboxes[holiday] || false}
                            onChange={() => handleHolidayDay(holiday)} />

                            <Typography ml={1}>{holiday}</Typography>
                          </Box>
                          {holidayList[holiday].map((hdate,index) => {
                              return(
                                <>
                                  <Box ml={5} className="checkBoxItem">

                                    <input type="checkbox" 
                                    key={`subcheck-${hdate.id}`} 
                                    value={hdate.id}  
                                    checked={childCheckboxes[hdate.id] || false}
                                    onChange={() => handleHolidaySubDay(hdate.id)} />

                                    <Typography className='checkBoxSubText' ml={1}>{hdate.title}({countCheckedDates(hdate.id)}/{countTotalDates(hdate.id)})</Typography>
                                  </Box>
                                </>
                              )
                          })}
                        </Box>
                      )
                    })}
                    
                </Box>
              </Box>


            
            </Box>


            <Box className="RightPanelBox">
              <Box className="RightHeader">
                <Typography mr={1} className='RightHeaderText'>{startEndDrop ? "Step 5:" : "Step 6:"}</Typography>
                <Typography style={{ marginLeft: "5px" }} className='RightSubText'>{startEndDrop ? "Choose Start and Finish Dates" : "Events"}</Typography>
              </Box>


              {/* start end date component*/}
              <Box sx={{ display: startEndDrop ? "block" : "none" }} className="StartEndCoverBox">
                <Box className="StartEnd_Cover">
                  <Box sx={{ width: "50%" }}>
                    <Typography mb={1} className='startDateLabel'>Start Date</Typography>
                    <Typography className='SubDate'>{startDate.toString().slice(4).slice(0, 12) || "July 20, 2023"}</Typography>
                  </Box>
                  <Box sx={{ width: "50%" }}>
                    <Typography mb={1} className='FinishDateLabel'>Finish Dates</Typography>
                    <Typography className='SubDate'>{endDate.toString().slice(4).slice(0, 12)  || "July 20, 2023"}</Typography>
                  </Box>
                </Box>
              
                {pageCountError && <Box className="DatePopup"><Box className="CloseDatePopup" onClick={()=>setPageCountError(false)}>X</Box><Typography mt={2} className='PageCountErrorMsg'>Number of pages should not be greater then 242.</Typography></Box>}
                
              </Box>

              {/* presets Events component */ }
              <Box sx={{ display: presetsEventsDrop ? "flex" : "none" }} className="presetsDropBox">

              {Object.keys(holidayList).map((holiday) => (
                <Box key={holiday}>
                  {holidayList[holiday].map((hdate, index2) => (
                    <Box key={hdate.id} sx={{display: childCheckboxes[hdate.id]? 'block': (countCheckedSubHoliday()==0 && firstShow==hdate.id)? 'block':'none'}}>
                      {HolidayBox(hdate)}
                    </Box>
                  ))}
                </Box>
              ))}
              
            
                <Box className="presetsEventsFooter">
                  <Box className="saveBtn" onClick={handleSaveDates}>
                    <Typography>SAVE</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
                
        <PriceBox updatePriceBox={priceBox}  nextUrl={handleNextUrl}  updatePageCount={handlePageCount}/>
      </Box>
      <ToastContainer autoClose={false} draggable={false} />
      <Footer />
    </>
  )
}
