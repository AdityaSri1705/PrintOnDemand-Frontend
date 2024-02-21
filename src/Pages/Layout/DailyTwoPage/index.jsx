import React, { useState, useEffect } from 'react';
import { Typography, Box, Radio } from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import "../../layout.css";
import "./style.css";

import DiaryBaseImage from "../../../Assets/images/diary_base.png";
import InsideCoverBinder from "../../../Assets/images/insideCoverBinder.png";
import EmptyPage from "../../../Assets/images/EmptyPage.jpg";
import DownArrow from "../../../Assets/images/DownArrow.svg";
import UpArrow from "../../../Assets/images/UpArrow.svg";
import rightArrow from "../../../Assets/images/rightArrow.png"
import leftArrow from "../../../Assets/images/leftArrow.png"
import LensIcon from "../../../Assets/images/lens.png"
import CloseIcon from "../../../Assets/images/cross.png"


export default function Layout({ updatePriceBox }) {

  const getQuarter = (d) => {
    d = d || new Date();
    var m = Math.ceil((d.getMonth() + 1) / 3);
    m = m > 4 ? m - 4 : m
    return m;
  }

  const getWeekQuarter = (d) => {
    const weekDays = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) + 1;
    var qtr = getQuarter(d);
    const WeekInYears = Math.ceil(weekDays / 7);
    const WeekInQuarter = WeekInYears - ((qtr - 1) * 13);
    const FinalWeekInQuarter = WeekInQuarter > 13 ? 13 : WeekInQuarter > 0 ? WeekInQuarter : 1;
    //console.log(d,weekDays, qtr, WeekInYears, WeekInQuarter,"=>",FinalWeekInQuarter)
    return FinalWeekInQuarter;
  }

  const dayOptions = { weekday: 'long' };
  const dateOptions = { month: 'long', day: 'numeric' };
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', dayOptions);
  const currentMonthDate = currentDate.toLocaleDateString('en-US', dateOptions);
  const currentWeekInQuarter = getWeekQuarter(currentDate);
  const WeeksQuaterImgArr = [277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289];
  const WeeksQuaterImgId = WeeksQuaterImgArr[currentWeekInQuarter - 1];


  const taskImages = {
    '101-102-103-104': '221',
    '101-102-103': '222',
    '101-102-104': '223',
    '101-102': '224',
    '101-103-104': '225',
    '101-103': '226',
    '101-104': '227',
    '101': '228',
    '102-103-104': '229',
    '102-103': '230',
    '102-104': '231',
    '102': '232',
    '103-104': '233',
    '103': '234',
    '104': '235',
    '-': '236'
  };



  const [layoutData, setLayoutData] = useState([])
  const [sectionData, setSectionData] = useState([
    { "section_title": "time", "default_val": "0" },
    { "section_title": "What would you like above your daily schedule?", "default_val": 0 },
    { "section_title": "Include these two options at the top?", "default_val": "98" },
    { "section_title": "What do you want included in your task list (left column)?", "default_val": "101,102" },
    { "section_title": "Right Page Custom Options - Block 1 (of 5)", "default_val": 0 },
    { "section_title": "Right Page Custom Options - Block 2 (of 5)", "default_val": 0 },
    { "section_title": "Right Page Custom Options - Block 3 (of 5)", "default_val": 0 },
    { "section_title": "Right Page Custom Options - Block 4 (of 5)", "default_val": 0 },
    { "section_title": "Right Page Custom Options - Block 5 (of 5)", "default_val": 0 }
  ])
  const [imageData, setImageData] = useState([])
  const [sectionOptData, setSectionOptData] = useState("")
  const [quoteData, setQuoteData] = useState([])
  const [priceBox, setPriceBox] = useState(1);

  const [defaultParameters, setDefaultParameters] = useState([])
  const [layoutTab, setLayoutTab] = useState("Hourly times")
  const [selectedTime, setSelectedTime] = useState("6am-10pm")
  const [dailySchedule, setDailySchedule] = useState("95")
  const [selectedWeeks, setSelectedWeeks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [taskImageId, setTaskImageId] = useState([224])

  const [timeBox, setTimeBox] = useState(true)
  const [scheduleBox, setScheduleBox] = useState(false)
  const [weekBox, setWeekBox] = useState(false)
  const [taskListBox, setTaskListBox] = useState(false)
  const [rightCustomBox1, setRightCustomBox1] = useState(true)
  const [rightCustomBox2, setRightCustomBox2] = useState(true)
  const [rightCustomBox3, setRightCustomBox3] = useState(true)
  const [rightCustomBox4, setRightCustomBox4] = useState(true)
  const [rightCustomBox5, setRightCustomBox5] = useState(true)

  const [customOption, setCustomOption] = useState(false);

  const [rightCustomRadio1, setRightCustomRadio1] = useState("")
  const [rightCustomRadio1Text, setRightCustomRadio1Text] = useState("")

  const [rightCustomRadio2, setRightCustomRadio2] = useState("")
  const [rightCustomRadio2Text, setRightCustomRadio2Text] = useState("")

  const [rightCustomRadio3, setRightCustomRadio3] = useState("")
  const [rightCustomRadio3Text, setRightCustomRadio3Text] = useState("")

  const [rightCustomRadio4, setRightCustomRadio4] = useState()
  const [rightCustomRadio4Text, setRightCustomRadio4Text] = useState("")

  const [rightCustomRadio5, setRightCustomRadio5] = useState()
  const [rightCustomRadio5Text, setRightCustomRadio5Text] = useState("")

  const [fullView, setFullView] = useState("")
  const [largeView, setLargeView] = useState(false)


  const handleLayoutChange = (layout) => {
    setLayoutTab(layout.title);

    if (layout.title !== "Hourly times") {
      setSelectedTime(layout.options);
    } else {
      setSelectedTime(sectionData[0].default_val);
    }
  }

  const handleSecondTimeRadioChange = (event) => {
    setSelectedTime(parseInt(event.target.value));
  };

  const handleDailyScheduleRadioChange = (event) => {
    setDailySchedule(parseInt(event.target.value));
  };

  const handleWeekCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const val = parseInt(value);
    let updatedSelectedWeek;

    if (!selectedWeeks.includes(val)) {
      updatedSelectedWeek = [...selectedWeeks, val];
    }
    if (selectedWeeks.includes(val)) {
      updatedSelectedWeek = selectedWeeks.filter((item) => item !== val);
    }

    setSelectedWeeks(updatedSelectedWeek);
  };

  const handleTaskCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const val = parseInt(value);
    let updatedSelectedTasks;

    if (!selectedTasks.includes(val)) {
      updatedSelectedTasks = [...selectedTasks, val];
    } else {
      updatedSelectedTasks = selectedTasks.filter((item) => item !== val);
    }
    updatedSelectedTasks = updatedSelectedTasks.filter(item => item !== 0);
    setSelectedTasks(updatedSelectedTasks);

    var imgId = '236';
    updatedSelectedTasks = updatedSelectedTasks.filter(item => item !== 100);

    if (updatedSelectedTasks.length) {
      updatedSelectedTasks = updatedSelectedTasks.sort((a, b) => a - b);
      updatedSelectedTasks = updatedSelectedTasks.join("-");

      imgId = taskImages[updatedSelectedTasks];
    }

    setTaskImageId(imgId);

  };

  const handleCustomRightRadio1Change = (event) => {
    setRightCustomRadio1(parseInt(event.target.value));
    setRightCustomRadio1Text("");
  };
  const handleCustomRightRadio2Change = (event) => {
    setRightCustomRadio2(parseInt(event.target.value));
    setRightCustomRadio2Text("");
  };
  const handleCustomRightRadio3Change = (event) => {
    setRightCustomRadio3(parseInt(event.target.value));
    setRightCustomRadio3Text("");
  };
  const handleCustomRightRadio4Change = (event) => {
    setRightCustomRadio4(parseInt(event.target.value));
    setRightCustomRadio4Text("");
  };
  const handleCustomRightRadio5Change = (event) => {
    setRightCustomRadio5(parseInt(event.target.value));
    setRightCustomRadio5Text("");
  };


  const RightBoxOnSelectChang = (Radio, RadioText) => {
    let text;
    switch (parseInt(Radio)) {
      case 113:
      case 114:
      case 115:
        text = RadioText
        break;
      default:
        text = ''
        break;
    }

    return <Typography className={largeView ? `DailyTwoRightActiveText ctext-${Radio}` : `DailyTwoRightText ctext-${Radio}`}>{text}</Typography>;
  }




  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;

    axios.get(`${BACKEND_URL}/api/V1/layout/DailyTwo`)
      .then(response => {
        const { layouts, sections, sectionOpts, imgData, quoteList } = response.data.result;
        setLayoutData(layouts);
        setSectionData(sections);
        setSectionOptData(sectionOpts);
        setImageData(imgData);
        setQuoteData(quoteList);
      })
      .catch(error => {
        console.error('Error fetching layout data:', error);
      });


  }, []);

  useEffect(() => {

    var defaultParameters = "";
    layoutData.forEach((layout) => {
      if (layout.isDefault === 1) {
        setLayoutTab(layout.title)
        defaultParameters = { ...defaultParameters, layoutTab: layout.title };
      }
    });
    // Check if sectionData is available and not empty
    if (sectionData && sectionData.length > 0) {

      sectionData.forEach((section, index) => {
        // Check index and default_val for each section and update state accordingly
        if (index === 0 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, selectedTime: section.default_val };
        }
        if (index === 1 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, dailySchedule: parseInt(section.default_val) };
        }
        if (index == 2) {
          if (section.default_val != "") {
            const DefaultWeeksList = section.default_val.split(',').map(Number);
            defaultParameters = { ...defaultParameters, selectedWeeks: DefaultWeeksList };
          } else {
            defaultParameters = { ...defaultParameters, selectedWeeks: [] };
          }
        }
        if (index == 3) {
          if (section.default_val != "") {
            const DefaultTasksList = section.default_val.split(',').map(Number);
            defaultParameters = { ...defaultParameters, selectedTasks: DefaultTasksList };
          } else {
            defaultParameters = { ...defaultParameters, selectedTasks: [] };
          }
        }
        if (index === 4 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, rightCustomRadio1: parseInt(section.default_val) };
        }
        if (index === 5 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, rightCustomRadio2: parseInt(section.default_val) };
        }
        if (index === 6 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, rightCustomRadio3: parseInt(section.default_val) };
        }
        if (index === 7 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, rightCustomRadio4: parseInt(section.default_val) };
        }
        if (index === 8 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, rightCustomRadio5: parseInt(section.default_val) };
        }
        defaultParameters = { ...defaultParameters, taskImageId: 224 };
      });

    }

    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Layout"));
    if (sessionData !== null) {
      const DailyTwoPageData = sessionData.DailyTwoPage;
      if (DailyTwoPageData !== undefined) {
        sessionData = DailyTwoPageData;
      }
    }

    // Merge default parameters with session data
    const mergedData = { ...defaultParameters, ...sessionData };


    setLayoutTab(mergedData.layoutTab);
    setSelectedTime(mergedData.selectedTime);
    setDailySchedule(mergedData.dailySchedule);
    setSelectedWeeks(mergedData.selectedWeeks);
    setSelectedTasks(mergedData.selectedTasks);
    setTaskImageId(mergedData.taskImageId);
    setRightCustomRadio1(mergedData.rightCustomRadio1);
    setRightCustomRadio1Text(mergedData.rightCustomRadio1Text);
    setRightCustomRadio2(mergedData.rightCustomRadio2);
    setRightCustomRadio2Text(mergedData.rightCustomRadio2Text);
    setRightCustomRadio3(mergedData.rightCustomRadio3);
    setRightCustomRadio3Text(mergedData.rightCustomRadio3Text);
    setRightCustomRadio4(mergedData.rightCustomRadio4);
    setRightCustomRadio4Text(mergedData.rightCustomRadio4Text);
    setRightCustomRadio5(mergedData.rightCustomRadio5);
    setRightCustomRadio5Text(mergedData.rightCustomRadio5Text);

  }, [layoutData, sectionData]);

  useEffect(() => {

    var NewLayoutData = JSON.parse(sessionStorage.getItem("Layout"));

    if (NewLayoutData !== null && NewLayoutData['DailyTwoPage'] !== undefined) {

      const DailyTwoPageData = {
        layoutTab: layoutTab,
        selectedTime: selectedTime,
        dailySchedule: dailySchedule,
        selectedWeeks: selectedWeeks,
        selectedTasks: selectedTasks,
        taskImageId: taskImageId,
        rightCustomRadio1: rightCustomRadio1,
        rightCustomRadio1Text: rightCustomRadio1Text,
        rightCustomRadio2: rightCustomRadio2,
        rightCustomRadio2Text: rightCustomRadio2Text,
        rightCustomRadio3: rightCustomRadio3,
        rightCustomRadio3Text: rightCustomRadio3Text,
        rightCustomRadio4: rightCustomRadio4,
        rightCustomRadio4Text: rightCustomRadio4Text,
        rightCustomRadio5: rightCustomRadio5,
        rightCustomRadio5Text: rightCustomRadio5Text
      };
      NewLayoutData['DailyTwoPage'] = DailyTwoPageData;
      sessionStorage.setItem("Layout", JSON.stringify(NewLayoutData));
    } else {
      sessionStorage.setItem("Layout", JSON.stringify({ DailyTwoPage: [] }));
    }

    updatePriceBox(priceBox + 1);

  }, [layoutTab, selectedTime, dailySchedule, selectedWeeks, selectedTasks, taskImageId, rightCustomRadio1, rightCustomRadio2, rightCustomRadio3, rightCustomRadio4, rightCustomRadio5, rightCustomRadio1Text, rightCustomRadio2Text, rightCustomRadio3Text, rightCustomRadio4Text, rightCustomRadio5Text])


  const TimeBox = ({ timeData, index }) => {
    return (
      <Box className="setTimeInRadioBox">
        <label className='radioLabel' >
          <Radio
            sx={{
              color: '#B8845F',
              '&.Mui-checked': {
                color: '#B8845F',
              },
            }}
            name='TimeInRadio'
            value={timeData.id}
            checked={selectedTime == timeData.id}
            onChange={handleSecondTimeRadioChange}
          />
        </label>
        <Typography>{timeData.title}</Typography>
      </Box>
    )
  }

  const DailyQouteImage = (tab) => {
    const newQuoteData = quoteData.filter((item) => item.type == 3);
    const randomIndex = Math.floor(Math.random() * newQuoteData.length);
    var quote = newQuoteData[randomIndex];
    return (
      <Box className={`QuoteContainer QuoteOnly`}>
        <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
        <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
      </Box>
    )
  }


  return (
    <>

      <Box className={fullView ? 'PageInnerBox fullexpand' : 'PageInnerBox'}>
        <Box className="LeftPanelBox">
          <Box className="LeftHeader">
            <Typography className='LeftTitle'>Daily Two-Page</Typography>
          </Box>
          <Box className="LeftInner">
            <Box mb={2} className="timeBox">
              {layoutData.map((layout, index) => (
                <Box key={`layout-${index}`} onClick={() => handleLayoutChange(layout)} className={layoutTab === layout.title ? "timeBoxItem timeBoxItemActive" : "timeBoxItem"}>
                  <Box className={layoutTab === layout.title ? "timeSBoxActive timeSBox" : "timeSBox"}></Box>
                  <Typography>{layout.title}</Typography>
                </Box>
              ))}
            </Box>




            <Box className="sideChangeableTab">
              <Box onClick={() => setCustomOption(!customOption)} mb={2} className="customOption">
                <Typography pl={2}>Custom Options</Typography>
                <img onClick={() => setCustomOption(!customOption)} className='customOptionDownArrow' src={customOption ? UpArrow : DownArrow} alt='' />
              </Box>

              <Box sx={{ display: customOption ? "block" : "none" }} >

                {/* Time Box */}
                <Box mb={2} sx={{ display: layoutTab === "Hourly times" ? "block" : "none" }} className={timeBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox"}>
                  <img onClick={() => setTimeBox(timeBox ? null : "Time")} className='leftCustomArrow' src={timeBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={timeBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setTimeBox(timeBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[0].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    <Box className="setTimeBox">
                      {sectionOptData[16] && sectionOptData[16].map((timesec, index) => (
                        index % 2 === 0 && sectionOptData[16][index + 1] ? (
                          <Box key={`time-${index}`} className="setTimeInsideBox">
                            <TimeBox timeData={timesec} index={index} />
                            <TimeBox timeData={sectionOptData[16][index + 1]} index={index + 1} />
                          </Box>
                        ) : null
                      ))}
                    </Box>
                  </Box>

                </Box>


                {/* week Box */}
                <Box mb={2} className={scheduleBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox x2"}>
                  <img onClick={() => setScheduleBox(scheduleBox ? null : "Time")} className='leftCustomArrow' src={scheduleBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={scheduleBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setScheduleBox(scheduleBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[1].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[17] && sectionOptData[17].map((scheduleData, index) => (
                      <Box key={`WRadio-${index}`} className="weekRadioBox">
                        <label className='radioLabel' >
                          <Radio
                            sx={{
                              color: '#B8845F',
                              '&.Mui-checked': {
                                color: '#B8845F',
                              },
                            }}
                            name='DailySchedule'
                            value={scheduleData.id}
                            checked={dailySchedule === scheduleData.id}
                            onChange={handleDailyScheduleRadioChange}
                          />
                        </label>
                        <Typography>{scheduleData.title}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>


                {/* week Box */}
                <Box mb={2} className={weekBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox"}>
                  <img onClick={() => setWeekBox(weekBox ? null : "Time")} className='leftCustomArrow' src={weekBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={weekBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setWeekBox(weekBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[2].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[18] && sectionOptData[18].map((weekData, index) => (
                      <Box key={`WRadio-${index}`} className="weekRadioBox">
                        <label className='radioLabel' >
                          <Radio
                            sx={{
                              color: '#B8845F',
                              '&.Mui-checked': {
                                color: '#B8845F',
                              },
                            }}
                            name={`WeekChkbox-${index}`}
                            value={weekData.id}
                            checked={selectedWeeks.includes(weekData.id)}
                            onClick={handleWeekCheckboxChange}
                          />
                        </label>
                        <Typography>{weekData.title}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>


                {/* Task list */}
                <Box mb={2} className={taskListBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox x2"}>
                  <img onClick={() => setTaskListBox(taskListBox ? null : "Time")} className='leftCustomArrow' src={taskListBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={taskListBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setTaskListBox(taskListBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[3].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[19] && sectionOptData[19].map((taskData, index) => (
                      <Box key={`taskLRadio-${index}`} className="weekRadioBox">
                        <label className='radioLabel' sx={{ marginTop: taskData.id == 102 ? '-8px' : '0px' }}>
                          <Radio
                            sx={{
                              color: '#B8845F',
                              '&.Mui-checked': {
                                color: '#B8845F',
                              },
                            }}
                            name={`TaskChkbox-${index}`}
                            value={taskData.id}
                            checked={selectedTasks.includes(taskData.id)}
                            onClick={handleTaskCheckboxChange}
                          />
                        </label>
                        <Typography>{taskData.title}</Typography>
                      </Box>
                    ))}

                  </Box>
                </Box>

                {/* Custom Right button page - 1 out 5 */}
                <Box mb={2} className={rightCustomBox1 ? "customPageTabBox customPageTabCloseBox" : "customPageTabBox"}>
                  <img onClick={() => setRightCustomBox1(!rightCustomBox1)} className='leftCustomArrow' src={rightCustomBox1 ? UpArrow : DownArrow} />
                  <Box mb={rightCustomBox1 ? 5 : 0} className="customPageBoxHeader">
                    <Typography onClick={() => setRightCustomBox1(!rightCustomBox1)} className='BoxHeaderText'>{sectionData[4].section_title}

                    </Typography>
                    {/* <Typography className='choseOneSubText'></Typography> */}
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[20] && sectionOptData[20].map((optData1, index) => (
                      <Box key={`RPRadio1-${index}`}>
                        <Box className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='RightPageRadio1'
                              value={optData1.id}
                              checked={rightCustomRadio1 === optData1.id}
                              onChange={handleCustomRightRadio1Change}
                            />
                          </label>
                          <Typography mr={2}>{optData1.title}</Typography>
                          {optData1.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData1.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData1.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={rightCustomRadio1 === optData1.id ? rightCustomRadio1Text : ''} type="text" placeholder='Title' onChange={(e) => setRightCustomRadio1Text(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>

                </Box>


                {/* Custom Right button page - 2 out 5 */}
                <Box mb={2} className={rightCustomBox2 ? "customPageTabBox customPageTabCloseBox" : "customPageTabBox"}>
                  <img onClick={() => setRightCustomBox2(!rightCustomBox2)} className='leftCustomArrow' src={rightCustomBox2 ? UpArrow : DownArrow} />
                  <Box mb={rightCustomBox2 ? 5 : 0} className="customPageBoxHeader">
                    <Typography onClick={() => setRightCustomBox2(!rightCustomBox2)} className='BoxHeaderText'>{sectionData[5].section_title}

                    </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[20] && sectionOptData[20].map((optData2, index) => (
                      <Box key={`RPRadio2-${index}`}>
                        <Box className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='RightPageRadio2'
                              value={optData2.id}
                              checked={rightCustomRadio2 === optData2.id}
                              onChange={handleCustomRightRadio2Change}
                            />
                          </label>
                          <Typography mr={2}>{optData2.title}</Typography>
                          {optData2.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData2.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData2.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={rightCustomRadio2 === optData2.id ? rightCustomRadio2Text : ''} type="text" placeholder='Title' onChange={(e) => setRightCustomRadio2Text(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>


                {/* Custom Right button page - 3 out 5 */}
                <Box mb={2} className={rightCustomBox3 ? "customPageTabBox customPageBottomRCloseBox" : "customPageTabBox"}>
                  <img onClick={() => setRightCustomBox3(!rightCustomBox3)} className='leftCustomArrow' src={rightCustomBox3 ? UpArrow : DownArrow} />
                  <Box mb={rightCustomBox3 ? 5 : 0} className="customPageBoxHeader">
                    <Typography onClick={() => setRightCustomBox3(!rightCustomBox3)} className='BoxHeaderText'>{sectionData[6].section_title}

                    </Typography>
                    {/* <Typography className='choseOneSubText'></Typography> */}
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[20] && sectionOptData[20].map((optData3, index) => (
                      <Box key={`RPRadio3-${index}`} >
                        <Box className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='RightPageRadio3'
                              value={optData3.id}
                              checked={rightCustomRadio3 === optData3.id}
                              onChange={handleCustomRightRadio3Change}
                            />
                          </label>
                          <Typography mr={2}>{optData3.title}</Typography>
                          {optData3.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData3.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData3.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={rightCustomRadio3 === optData3.id ? rightCustomRadio3Text : ''} type="text" placeholder='Title' onChange={(e) => setRightCustomRadio3Text(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>

                </Box>



                {/* Custom Right button page - 4 out 5 */}
                <Box mb={2} className={rightCustomBox4 ? "customPageTabBox customPageBottomRCloseBox" : "customPageTabBox"}>
                  <img onClick={() => setRightCustomBox4(!rightCustomBox4)} className='leftCustomArrow' src={rightCustomBox4 ? UpArrow : DownArrow} />
                  <Box mb={rightCustomBox4 ? 5 : 0} className="customPageBoxHeader">
                    <Typography onClick={() => setRightCustomBox4(!rightCustomBox4)} className='BoxHeaderText'>{sectionData[7].section_title}

                    </Typography>
                    {/* <Typography className='choseOneSubText'></Typography> */}
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[20] && sectionOptData[20].map((optData4, index) => (
                      <Box key={`RPRadio4-${index}`}>
                        <Box className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='RightPageRadio4'
                              value={optData4.id}
                              checked={rightCustomRadio4 === optData4.id}
                              onChange={handleCustomRightRadio4Change}
                            />
                          </label>
                          <Typography mr={2}>{optData4.title}</Typography>
                          {optData4.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData4.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData4.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={rightCustomRadio4 === optData4.id ? rightCustomRadio4Text : ''} type="text" placeholder='Title' onChange={(e) => setRightCustomRadio4Text(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>

                </Box>



                {/* Custom Right button page - 5 out 5 */}
                <Box mb={2} className={rightCustomBox5 ? "customPageTabBox customPageBottomRCloseBox" : "customPageTabBox"}>
                  <img onClick={() => setRightCustomBox5(!rightCustomBox5)} className='leftCustomArrow' src={rightCustomBox5 ? UpArrow : DownArrow} />
                  <Box mb={rightCustomBox5 ? 5 : 0} className="customPageBoxHeader">
                    <Typography onClick={() => setRightCustomBox5(!rightCustomBox5)} className='BoxHeaderText'>{sectionData[8].section_title}

                    </Typography>
                    {/* <Typography className='choseOneSubText'></Typography> */}
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[20] && sectionOptData[20].map((optData5, index) => (
                      <Box key={`RPRadio5-${index}`}>
                        <Box className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='RightPageRadio4'
                              value={optData5.id}
                              checked={rightCustomRadio5 === optData5.id}
                              onChange={handleCustomRightRadio5Change}
                            />
                          </label>
                          <Typography mr={2}>{optData5.title}</Typography>
                          {optData5.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData5.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData5.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={rightCustomRadio5 === optData5.id ? rightCustomRadio5Text : ''} type="text" placeholder='Title' onChange={(e) => setRightCustomRadio5Text(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

            </Box>
          </Box>

          {fullView ?
            <Box onClick={() => setFullView(false)} className="sideButton">
              <img src={rightArrow} />
            </Box> :
            <Box onClick={() => setFullView(true)} className="sideButton">
              <img src={leftArrow} />
            </Box>
          }


        </Box>

        <Box className="RightPanelBox">
          <Box className="RightHeader">
            <Typography mr={1} className='RightHeaderText'>Step 3:</Typography>
            <Typography className='RightSubText'>Select your layout (above), and customize it in the design box to the left</Typography>
            {/* <Typography className='ChooseCoverSubText'></Typography> */}
          </Box>
          <Box className={largeView ? 'PreviewOuter largeview' : 'PreviewOuter '}>
            <Box mt={3} className="PreviewContainer">
              <img src={DiaryBaseImage} className='diray_base' alt="" />
              <Box className="diray_inner">
                <Box mr={1} className="diray_page leftpage">

                  <Box className="DailyTB-B0 ">
                    {sectionOptData[18] && sectionOptData[18].map((weekData, index) => (
                      imageData[WeeksQuaterImgId] != undefined && selectedWeeks.includes(weekData.id) && index === 1 && <img className='FullWidthImg weekquater' src={imageData[WeeksQuaterImgId].left_image} alt='' />
                    ))}
                  </Box>
                  <Box className="DailyTB-B1">
                    <Typography className="DailyDateBTitle">{currentDay}</Typography>
                    <Typography className="DailyDateSTitle" >{currentMonthDate}</Typography>
                  </Box>
                  <Box className="DailyTB-B2">
                    {sectionOptData[19] && sectionOptData[19].map((taskData, index) => (
                      selectedTasks.includes(taskData.id) && index == 0 && <img className='FullWidthImg preweek' src={imageData[taskData.id].left_image} alt='' />
                    ))}

                  </Box>
                  <Box className="DailyTB-B3">
                    {imageData[taskImageId] !== undefined && (<img className='PageSubImages' src={imageData[taskImageId].left_image} alt='' />)}
                  </Box>
                  {dailySchedule != 97 && (<Box className="DailyTB-B4">
                    {dailySchedule && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[dailySchedule].left_image} alt='' />)}
                  </Box>)}
                  <Box className={dailySchedule == 97 ? 'DailyTB-B5 shiftup' : 'DailyTB-B5'}>
                    {dailySchedule != 97 && selectedTime > 0 && Object.keys(imageData).length > 0 && (<img className="PageSubImages" src={imageData[selectedTime].left_image} alt='' />)}
                    {dailySchedule == 97 && selectedTime > 0 && Object.keys(imageData).length > 0 && (<img className="PageSubImages" src={imageData[selectedTime].right_image} alt='' />)}
                  </Box>



                </Box>
                <Box ml={1} className="diray_page rightpage">
                  <img className='DTC_binder' src={InsideCoverBinder} alt='' />

                  <Box className="DailyTB-B6">
                    {sectionOptData[18] && sectionOptData[18].map((weekData, index) => (
                      selectedWeeks.includes(weekData.id) && index === 0 && DailyQouteImage(weekData.id)
                    ))}
                  </Box>
                  <Box className={(rightCustomRadio1 == 116) ? 'DailyTB-B7 LineContinue' : 'DailyTB-B7'} >
                    {rightCustomRadio1 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[rightCustomRadio1].right_image} alt='' />)}
                    {RightBoxOnSelectChang(rightCustomRadio1, rightCustomRadio1Text)}
                  </Box>
                  <Box className={(rightCustomRadio2 == 116) ? 'DailyTB-B8 LineContinue' : 'DailyTB-B8'}>
                    {rightCustomRadio2 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[rightCustomRadio2].right_image} alt='' />)}
                    {RightBoxOnSelectChang(rightCustomRadio2, rightCustomRadio2Text)}
                  </Box>
                  <Box className={(rightCustomRadio3 == 116) ? 'DailyTB-B9 LineContinue' : 'DailyTB-B9'}>
                    {rightCustomRadio3 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[rightCustomRadio3].right_image} alt='' />)}
                    {RightBoxOnSelectChang(rightCustomRadio3, rightCustomRadio3Text)}
                  </Box>
                  <Box className={(rightCustomRadio4 == 116) ? 'DailyTB-B10 LineContinue' : 'DailyTB-B10'}>
                    {rightCustomRadio4 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[rightCustomRadio4].right_image} alt='' />)}
                    {RightBoxOnSelectChang(rightCustomRadio4, rightCustomRadio4Text)}
                  </Box>
                  <Box className={(rightCustomRadio5 == 116) ? 'DailyTB-B11 LineContinue' : 'DailyTB-B11'}>
                    {rightCustomRadio5 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[rightCustomRadio5].right_image} alt='' />)}
                    {RightBoxOnSelectChang(rightCustomRadio5, rightCustomRadio5Text)}
                  </Box>

                </Box>
              </Box>

              {largeView && <Box className="CloseLargeView" onClick={() => setLargeView(false)}>
                <img src={CloseIcon} className='closeIcon' alt="Close LargeView" />
              </Box>}

            </Box>

            {!largeView && <Box className="LargeView" onClick={() => setLargeView(true)}>
              <img src={LensIcon} className='lensIcon' alt="LargeView" />
            </Box>}
            

          </Box>
        </Box>
      </Box>

    </>
  )
}
