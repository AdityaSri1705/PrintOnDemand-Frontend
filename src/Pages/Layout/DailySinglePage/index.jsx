import React, { useState, useEffect } from 'react';
import { Typography, Box, Radio } from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import "../../layout.css";
import "./style.css";

import DiaryBaseImage from "../../../Assets/images/diary_base.png";

import InsideCoverBinder from "../../../Assets/images/insideCoverBinder.png";
import DownArrow from "../../../Assets/images/DownArrow.svg";
import UpArrow from "../../../Assets/images/UpArrow.svg";
import rightArrow from "../../../Assets/images/rightArrow.png"
import leftArrow from "../../../Assets/images/leftArrow.png"
import LensIcon from "../../../Assets/images/lens.png"
import CloseIcon from "../../../Assets/images/cross.png"



//Component 

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
  const WeeksQuaterImgArr = [264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276];
  const WeeksQuaterImgId = WeeksQuaterImgArr[currentWeekInQuarter - 1];

  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDay = nextDate.toLocaleDateString('en-US', dayOptions);
  const nextMonthDate = nextDate.toLocaleDateString('en-US', dateOptions);
  const nextWeekInQuarter = getWeekQuarter(nextDate);
  const nextWeeksQuaterImgId = WeeksQuaterImgArr[nextWeekInQuarter - 1];


  const taskImages = {
    '7-8-9-10': '201',
    '7-8-9': '202',
    '7-8-10': '203',
    '7-8': '204',
    '7-9-10': '205',
    '7-9': '206',
    '7-10': '207',
    '7': '208',
    '8-9-10': '209',
    '8-9': '210',
    '8-10': '211',
    '8': '212',
    '9-10': '213',
    '9': '214',
    '10': '215',
    '-': '216'
  };

  const usedQuotes = {};

  const getQuoteContent = (type) => {
    if (!usedQuotes[type]) {
      usedQuotes[type] = [];
    }

    var newQuoteData = quoteData.filter((item) => item.type === type && !usedQuotes[type].includes(item));

    if (newQuoteData.length === 0) {
      // All quotes of this type have been used, reset the usedQuotes array
      usedQuotes[type] = [];
      newQuoteData = quoteData.filter((item) => item.type === type && !usedQuotes[type].includes(item));
    }

    const randomIndex = Math.floor(Math.random() * newQuoteData.length);
    const selectedQuote = newQuoteData[randomIndex];

    // Mark the selected quote as used
    usedQuotes[type].push(selectedQuote);

    return selectedQuote;
  }



  const [layoutData, setLayoutData] = useState([])
  const [sectionData, setSectionData] = useState([
    { section_title: `time`, default_val: 2 },
    { section_title: `Include these two options at the top1?`, default_val: "" },
    { section_title: `What do you want included in your task list?`, default_val: "7,8" },
    { section_title: `Bottom Left custom option`, default_val: 14 },
    { section_title: `Bottom Right custom option`, default_val: 15 }
  ])
  const [imageData, setImageData] = useState([])
  const [sectionOptData, setSectionOptData] = useState("")
  const [quoteData, setQuoteData] = useState([])
  const [priceBox, setPriceBox] = useState(1);

  const [layoutTab, setLayoutTab] = useState("Hourly times")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedWeeks, setSelectedWeeks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [taskImageId, setTaskImageId] = useState([204])

  const [timeBox, setTimeBox] = useState(true)
  const [weekBox, setWeekBox] = useState(false)
  const [taskListBox, setTaskListBox] = useState(false)
  const [bottomRightBox, setBottomRightBox] = useState(false)
  const [bottomLeftBox, setBottomLeftBox] = useState(false)
  const [customOption, setCustomOption] = useState(false);


  const [bottomLeftTab, setBottomLeftTab] = useState("")
  const [bottomLeftCustomText, setBottomLeftCustomText] = useState("")

  const [bottomRightTab, setBottomRightTab] = useState("")
  const [bottomRightCustomText, setBottomRightCustomText] = useState("")

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
    setSelectedTime(event.target.value);
  };

  const handleWeekCheckboxChange = (event) => {
    const { value } = event.target;
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
    const { value } = event.target;
    const val = parseInt(value);
    let updatedSelectedTasks;

    if (!selectedTasks.includes(val)) {
      updatedSelectedTasks = [...selectedTasks, val];
    } else {
      updatedSelectedTasks = selectedTasks.filter((item) => item !== val);
    }

    setSelectedTasks(updatedSelectedTasks);

    var imgId = '216';
    if (updatedSelectedTasks.length) {
      updatedSelectedTasks = updatedSelectedTasks.sort((a, b) => a - b);
      updatedSelectedTasks = updatedSelectedTasks.join("-");

      imgId = taskImages[updatedSelectedTasks];
    }

    setTaskImageId(imgId);

  };


  const handleCustomBotomLeftRadioChange = (event) => {
    setBottomLeftTab(parseInt(event.target.value));
    setBottomLeftCustomText("");
  };
  const handleCustomBottomRightRadioChange = (event) => {
    setBottomRightTab(parseInt(event.target.value));
    setBottomRightCustomText("");
  };
  const BottomLeftOnSelectChang = (tab, type) => {

    var imgid = parseInt(tab);
    if (imgid == 15) {
      //for Reflection and Gratitude with a Quote
      var quote = getQuoteContent(1);
      if (type == "Right") {
        return (
          <Box className={`QuoteContainer RefQuote`}>
            <img className='QuoteImage' src={imageData[imgid].right_image} alt='' />
            <Box className={`QuoteSubContainer`}>
              <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
              <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
            </Box>
          </Box>
        )
      } else {
        return (
          <Box className={`QuoteContainer RefQuote`}>
            <img className='QuoteImage' src={imageData[imgid].left_image} alt='' />
            <Box className={`QuoteSubContainer`}>
              <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
              <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
            </Box>
          </Box>
        )
      }
    } else if (imgid == 12) {
      //for quotes only
      var quote = getQuoteContent(2);
      return (
        <Box className={`QuoteContainer QuoteOnly`}>
          <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
          <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
        </Box>
      )
    } else {
      if (type == "Right") {
        return <img className='PageSubImages' src={imageData[imgid].right_image} alt='' />;
      } else {
        return <img className='PageSubImages' src={imageData[imgid].left_image} alt='' />;
      }
    }
  }

  const BottomLeftOnSelectTextChang = () => {
    let text;
    switch (parseInt(bottomLeftTab)) {
      case 18:
      case 19:
      case 20:
        text = bottomLeftCustomText
        break;
      default:
        text = ''
        break;
    }
    return <Typography className={`BottomLeftDText ctext-${bottomLeftTab}`}>{text}</Typography>;
  }

  const BottomRightOnSelectChang = (tab, type) => {
    var imgid = parseInt(tab);
    if (imgid == 15) {
      //for Reflection and Gratitude with a Quote
      var quote = getQuoteContent(1);
      if (type == "Right") {
        return (
          <Box className={`QuoteContainer RefQuote`}>
            <img className='QuoteImage' src={imageData[imgid].right_image} alt='' /><Box className={`QuoteSubContainer`}>
              <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
              <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
            </Box>
          </Box>
        )
      } else {
        return (
          <Box className={`QuoteContainer RefQuote`}>
            <img className='QuoteImage' src={imageData[imgid].left_image} alt='' />
            <Box className={`QuoteSubContainer`}>
              <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
              <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
            </Box>
          </Box>
        )
      }
    } else if (imgid == 12) {
      //for quotes only
      var quote = getQuoteContent(2);
      return (
        <Box className={`QuoteContainer QuoteOnly`}>
          <Typography className={largeView ? 'QuoteText QuoteLVText' : "QuoteText QuoteNVText"}>{quote.quote_text}</Typography>
          <Typography className={largeView ? ' authorLV' : " authorNV"}>{quote.author}</Typography>
        </Box>
      )
    } else {
      if (type == "Right") {
        return <img className='PageSubImages' src={imageData[imgid].right_image} alt='' />;
      } else {
        return <img className='PageSubImages' src={imageData[imgid].left_image} alt='' />;
      }
    }

  }

  const BottomRightOnSelectTextChang = () => {
    let text;
    switch (bottomRightTab) {
      case 18:
      case 19:
      case 20:
        text = bottomRightCustomText
        break;
      default:
        text = ''
        break;
    }
    return <Typography className={`BottomRightDText ctext-${bottomRightTab}`}>{text}</Typography>;
  }


  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;

    axios.get(`${BACKEND_URL}/api/V1/layout/DailySingle`)
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
        if (index == 1) {
          if (section.default_val != "") {
            const DefaultWeeksList = section.default_val.split(',').map(Number)
            defaultParameters = { ...defaultParameters, selectedWeeks: DefaultWeeksList };
          } else {
            defaultParameters = { ...defaultParameters, selectedWeeks: [] };
          }
        }
        if (index == 2) {
          if (section.default_val != "") {
            const DefaultTasksList = section.default_val.split(',').map(Number);
            defaultParameters = { ...defaultParameters, selectedTasks: DefaultTasksList };
          } else {
            defaultParameters = { ...defaultParameters, selectedTasks: [] };
          }
        }
        if (index === 3 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, bottomLeftTab: parseInt(section.default_val) };
        }
        if (index === 4 && section.default_val > 0) {
          defaultParameters = { ...defaultParameters, bottomRightTab: parseInt(section.default_val) };
        }
        defaultParameters = { ...defaultParameters, taskImageId: 204 };
      });

    }

    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Layout"));
    if (sessionData !== null) {
      const DailySinglePageData = sessionData.DailySinglePage;
      if (DailySinglePageData !== undefined) {
        sessionData = DailySinglePageData;
      }
    }


    // Merge default parameters with session data
    const mergedData = { ...defaultParameters, ...sessionData };


    setLayoutTab(mergedData.layoutTab);
    setSelectedTime(mergedData.selectedTime);
    setSelectedWeeks(mergedData.selectedWeeks);
    setSelectedTasks(mergedData.selectedTasks);
    setTaskImageId(mergedData.taskImageId);
    setBottomLeftTab(mergedData.bottomLeftTab);
    setBottomLeftCustomText(mergedData.bottomLeftCustomText);
    setBottomRightTab(mergedData.bottomRightTab);
    setBottomRightCustomText(mergedData.bottomRightCustomText);

  }, [layoutData, sectionData]);

  useEffect(() => {


    var NewLayoutData = JSON.parse(sessionStorage.getItem("Layout"));

    if (NewLayoutData !== null && NewLayoutData['DailySinglePage'] !== undefined) {
      const DailySinglePageData = {
        layoutTab: layoutTab,
        selectedTime: selectedTime,
        selectedWeeks: selectedWeeks,
        selectedTasks: selectedTasks,
        taskImageId: taskImageId,
        bottomLeftTab: bottomLeftTab,
        bottomLeftCustomText: bottomLeftCustomText,
        bottomRightTab: bottomRightTab,
        bottomRightCustomText: bottomRightCustomText
      };
      NewLayoutData['DailySinglePage'] = DailySinglePageData;
      sessionStorage.setItem("Layout", JSON.stringify(NewLayoutData));
    } else {
      sessionStorage.setItem("Layout", JSON.stringify({ DailySinglePage: [] }));
    }

    updatePriceBox(priceBox + 1);

  }, [layoutTab, selectedTime, selectedWeeks, selectedTasks, taskImageId, bottomLeftTab, bottomLeftCustomText, bottomRightTab, bottomRightCustomText])

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


  return (
    <>
      <Box className={fullView ? 'PageInnerBox fullexpand' : 'PageInnerBox'}>
        <Box className="LeftPanelBox">
          <Box className="LeftHeader">
            <Typography className='LeftTitle'>Daily One-Page</Typography>
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
                      {sectionOptData[1] && sectionOptData[1].map((timesec, index) => (
                        index % 2 === 0 && sectionOptData[1][index + 1] ? (
                          <Box key={`time-${index}`} className="setTimeInsideBox">
                            <TimeBox timeData={timesec} index={index} />
                            <TimeBox timeData={sectionOptData[1][index + 1]} index={index + 1} />
                          </Box>
                        ) : null
                      ))}
                    </Box>
                  </Box>
                </Box>


                {/* week Box */}
                <Box mb={2} className={weekBox ? "customPageTabBox " : "customPageTabBox x2 customPageTabCloseBox"}>
                  <img onClick={() => setWeekBox(weekBox ? null : "Time")} className='leftCustomArrow' src={weekBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={weekBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setWeekBox(weekBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[1].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[2] && sectionOptData[2].map((weekData, index) => (
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
                  <Box mb={weekBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setTaskListBox(taskListBox ? null : "Time")} className='BoxHeaderText'>
                      {sectionData[2].section_title} </Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[3] && sectionOptData[3].map((taskData, index) => (
                      <Box key={`taskLRadio-${index}`} className="weekRadioBox">
                        <label className='radioLabel' >
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




                {/* Custom Bottom Left page */}
                <Box mb={2} className={bottomLeftBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox"}>
                  <img onClick={() => setBottomLeftBox(bottomLeftBox ? null : "BottomLeft")} className='leftCustomArrow' src={bottomLeftBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={bottomLeftBox ? 0 : 5} className="customPageBoxHeader">
                    <Typography onClick={() => setBottomLeftBox(bottomLeftBox ? null : "BottomLeft")} className='BoxHeaderText'>
                      {sectionData[3].section_title} <span class="choseOneSubText">(choose one)</span></Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[4] && sectionOptData[4].map((optData, index) => (
                      <Box key={`BLRadio-${index}`}>
                        <Box key={`aBLRadio-${index}`} className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='BottomLeftRadio'
                              value={optData.id}
                              checked={bottomLeftTab === optData.id}
                              onChange={handleCustomBotomLeftRadioChange}
                            />
                          </label>
                          <Typography mr={2}>{optData.title}</Typography>
                          {optData.hint && (<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <title>{optData.hint}</title>
                            <path d="M9.50018 11.4679L9.50739 11.4683C9.61695 11.4739 9.72672 11.4645 9.83362 11.4401C9.92033 11.4186 10.0053 11.3907 10.0878 11.3564L10.2722 11.2799L10.223 11.4734L10.1139 11.903L10.1011 11.9533L10.0526 11.9718C9.72937 12.0947 9.4702 12.1895 9.27544 12.2559L9.27352 12.2566L9.27351 12.2566C9.04401 12.3297 8.8041 12.3647 8.56331 12.3602C8.21237 12.3807 7.8657 12.2741 7.58679 12.0599L7.58601 12.0593C7.34506 11.8705 7.20504 11.5808 7.2068 11.2747M9.50018 11.4679L7.67157 7.37497M9.50018 11.4679L9.49299 11.4686C9.36519 11.4805 9.23689 11.4531 9.12528 11.3901C9.05571 11.3133 9.02281 11.2098 9.03562 11.1066L9.03604 11.1067L9.03633 11.0974C9.03972 10.9887 9.0527 10.8805 9.07513 10.774L9.07518 10.774L9.07573 10.7709C9.09801 10.6456 9.12678 10.5215 9.16199 10.3992L9.56386 9.01653C9.56392 9.01635 9.56397 9.01616 9.56402 9.01598M9.50018 11.4679L9.56402 9.01598M7.2068 11.2747C7.20678 11.156 7.21508 11.0376 7.23166 10.9201L7.23175 10.9194C7.25179 10.7841 7.27861 10.65 7.31212 10.5175L7.31301 10.514L7.31307 10.514L7.7185 9.12395C7.71854 9.12381 7.71858 9.12367 7.71862 9.12353C7.75546 8.9929 7.78546 8.86944 7.80874 8.75307L7.8091 8.75127L7.80912 8.75128C7.83215 8.64624 7.84394 8.53902 7.8443 8.43146L7.84433 8.42081L7.8449 8.42087C7.85613 8.31866 7.82701 8.21632 7.7641 8.1355C7.65862 8.06931 7.53373 8.04049 7.40962 8.05394L7.39961 8.05502L7.3996 8.05452C7.30071 8.05527 7.20238 8.06989 7.1075 8.09792C6.99896 8.13186 6.90497 8.16207 6.82831 8.18874L6.65207 8.25006L6.69861 8.06936L6.81451 7.61936L6.82724 7.56992L6.87475 7.55123C7.14244 7.44597 7.39799 7.35542 7.64134 7.27965M7.2068 11.2747C7.2068 11.2745 7.2068 11.2744 7.2068 11.2743L7.3068 11.2749L7.2068 11.275C7.2068 11.2749 7.2068 11.2748 7.2068 11.2747ZM7.64134 7.27965C7.64151 7.2796 7.64168 7.27954 7.64185 7.27949L7.67157 7.37497M7.64134 7.27965C7.64119 7.2797 7.64103 7.27975 7.64087 7.2798L7.67157 7.37497M7.64134 7.27965C7.87026 7.20586 8.10887 7.16639 8.34935 7.16252M7.67157 7.37497C7.892 7.30387 8.12181 7.26596 8.3534 7.26247M8.34935 7.16252C8.34849 7.16258 8.34763 7.16263 8.34678 7.16269L8.3534 7.26247M8.34935 7.16252C8.3502 7.16251 8.35104 7.1625 8.35189 7.16248L8.3534 7.26247M8.34935 7.16252C8.69589 7.14015 9.0388 7.24437 9.31429 7.45587L9.31806 7.45876L9.31799 7.45885C9.54976 7.65493 9.67948 7.94594 9.67045 8.24932M8.3534 7.26247L9.67045 8.24932M9.56402 9.01598C9.6074 8.87302 9.63607 8.726 9.64959 8.57719L9.65 8.57723V8.56814C9.65 8.49595 9.6548 8.43471 9.65977 8.38295C9.66073 8.37297 9.66175 8.36289 9.66276 8.35286C9.66657 8.31532 9.67031 8.27841 9.67045 8.24932M9.56402 9.01598L9.6704 8.25082C9.67041 8.25032 9.67043 8.24982 9.67045 8.24932M9.99508 4.93114C9.79115 4.74432 9.52291 4.64358 9.24643 4.64997C8.97033 4.64435 8.70255 4.7449 8.49835 4.93088C8.11676 5.26095 8.07442 5.83784 8.40405 6.22011C8.43326 6.25399 8.46491 6.28567 8.49876 6.31492C8.9248 6.69537 9.56859 6.69532 9.99454 6.31475C10.3765 5.98167 10.4164 5.40205 10.0835 5.01978M9.99508 4.93114L10.0836 5.01986C10.0836 5.01983 10.0836 5.01981 10.0835 5.01978M9.99508 4.93114C10.0265 4.95861 10.0561 4.98823 10.0835 5.01978M9.99508 4.93114L10.0835 5.01978M7.81475 9.15109C7.85225 9.01814 7.88292 8.89202 7.9068 8.7727L7.81475 9.15109ZM8.5 0.9C4.30263 0.9 0.9 4.30263 0.9 8.5C0.9 12.6974 4.30263 16.1 8.5 16.1C12.6974 16.1 16.1 12.6974 16.1 8.5C16.1 4.30263 12.6974 0.9 8.5 0.9ZM8.5 15.2182C4.78964 15.2182 1.78183 12.2104 1.78183 8.5C1.78183 4.78964 4.78964 1.78183 8.5 1.78183C12.2104 1.78183 15.2182 4.78964 15.2182 8.5C15.2182 12.2104 12.2104 15.2182 8.5 15.2182Z" fill="#A8A8A8" stroke="#A8A8A8" stroke-width="0.2" />
                          </svg>)}
                        </Box>

                        {optData.type == "Custom" && (
                          <Box className="customRadioInputBoxInput">
                            <input value={bottomLeftTab === optData.id ? bottomLeftCustomText : ''} type="text" placeholder='Title' onChange={(e) => setBottomLeftCustomText(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}

                  </Box>

                </Box>

                {/* Custom Bottom right page */}
                <Box mb={2} className={bottomRightBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox"}>
                  <img onClick={() => setBottomRightBox(bottomRightBox ? null : "BottomRight")} className='leftCustomArrow' src={bottomRightBox ? UpArrow : DownArrow} alt='' />
                  <Box mb={bottomRightBox ? 0 : 5} className="customPageTabHeader">
                    <Typography onClick={() => setBottomRightBox(bottomRightBox ? null : "BottomRight")} className='BoxHeaderText'>
                      {sectionData[4].section_title} <span class="choseOneSubText">(choose one)</span></Typography>
                  </Box>
                  <Box className="customRadioBox">
                    {sectionOptData[4] && sectionOptData[4].map((optData2, index) => (
                      <>
                        <Box key={`BRRadio-${index}`} className="customRadioInputBox">
                          <label className='radioLabel' >
                            <Radio
                              sx={{
                                color: '#B8845F',
                                '&.Mui-checked': {
                                  color: '#B8845F',
                                },
                              }}
                              name='BottomRightRadio'
                              value={optData2.id}
                              checked={bottomRightTab === optData2.id}
                              onChange={handleCustomBottomRightRadioChange}
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
                            <input value={bottomRightTab === optData2.id ? bottomRightCustomText : ''} type="text" placeholder='Title' onChange={(e) => setBottomRightCustomText(e.target.value)} />
                            <Box className="titleSaveButton">
                              <Typography>Save</Typography>
                            </Box>
                          </Box>
                        )}
                      </>
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
            <Typography className='RightSubText'>
              Select your layout (above), and customize it in the design box to the left
            </Typography>
          </Box>
          <Box className={largeView ? 'PreviewOuter largeview' : 'PreviewOuter '}>
            <Box mt={3} className='PreviewContainer' >

              <img src={DiaryBaseImage} className='diray_base' alt="" />
              <Box className="diray_inner">
                <Box className="diray_page leftpage">


                  <Box className="DailySB-B0">
                    <Typography className="DailyDateBTitle">{currentDay}</Typography>
                    <Typography className="DailyDateSTitle">{currentMonthDate}</Typography>
                  </Box>
                  <Box className="DailySB-B1">
                    {sectionOptData[2] && sectionOptData[2].map((weekData, index) => (
                      imageData[WeeksQuaterImgId] != undefined && selectedWeeks.includes(weekData.id) && index === 0 && <img className='FullWidthImg weekquater' src={imageData[WeeksQuaterImgId].left_image} alt='' />
                    ))}
                  </Box>
                  <Box className="DailySB-B2">
                    {sectionOptData[2] && sectionOptData[2].map((weekData, index) => (
                      selectedWeeks.includes(weekData.id) && index === 1 && <img className='FullWidthImg preweek' src={imageData[weekData.id].left_image} alt='' />
                    ))}
                  </Box>
                  <Box className="DailySB-B3">
                    {/*sectionOptData[3] && sectionOptData[3].map((taskData, index) => (
                          selectedTasks.includes(`${taskData.id}`) && <img className='FullWidthImg' src={imageData[taskData.id].left_image} alt=''/>
                        ))*/}
                    {imageData[taskImageId] !== undefined && (<img className='PageSubImages' src={imageData[taskImageId].left_image} alt='' />)}
                  </Box>
                  <Box className="DailySB-B4">
                    {selectedTime && Object.keys(imageData).length > 0 && imageData[selectedTime] != undefined && (<img className='PageSubImages' src={imageData[selectedTime].left_image} alt='' />)}
                  </Box>
                  <Box className="DailySB-B5">

                    {bottomLeftTab && Object.keys(imageData).length > 0 && imageData[bottomLeftTab] != undefined && BottomLeftOnSelectChang(bottomLeftTab, 'left')}
                    {BottomLeftOnSelectTextChang()}
                  </Box>
                  <Box className="DailySB-B6">
                    {bottomRightTab && Object.keys(imageData).length > 0 && imageData[bottomRightTab] != undefined && BottomRightOnSelectChang(bottomRightTab, 'left')}
                    {BottomRightOnSelectTextChang()}
                  </Box>

                </Box>
                <Box ml={2} className="diray_page rightpage">
                   <img className='insideCover_binder' src={InsideCoverBinder} alt='' />
                  <Box className="DailySB-B0">
                    <Typography className="DailyDateBTitle">{nextDay}</Typography>
                    <Typography className="DailyDateSTitle">{nextMonthDate}</Typography>
                  </Box>
                  <Box className="DailySB-B1">
                    {sectionOptData[2] && sectionOptData[2].map((weekData, index) => (
                      imageData[nextWeeksQuaterImgId] != undefined && selectedWeeks.includes(weekData.id) && index === 0 && <img className='FullWidthImg weekquater' src={imageData[nextWeeksQuaterImgId].left_image} alt='' />
                    ))}
                  </Box>
                  <Box className="DailySB-B2">
                    {sectionOptData[2] && sectionOptData[2].map((weekData, index) => (
                      selectedWeeks.includes(weekData.id) && index === 1 && <img className='FullWidthImg preweek' src={imageData[weekData.id].right_image} alt='' />
                    ))}
                  </Box>
                  <Box className="DailySB-B3">
                    {imageData[taskImageId] !== undefined && (<img className='PageSubImages' src={imageData[taskImageId].left_image} alt='' />)}
                  </Box>
                  <Box className="DailySB-B4">
                    {selectedTime && Object.keys(imageData).length > 0 && imageData[selectedTime] != undefined && (<img className='PageSubImages' src={imageData[selectedTime].right_image} alt='' />)}
                  </Box>
                  <Box className="DailySB-B5">
                    {bottomLeftTab && Object.keys(imageData).length > 0 && imageData[bottomLeftTab] != undefined && BottomLeftOnSelectChang(bottomLeftTab, 'Right')}
                    {BottomLeftOnSelectTextChang()}
                  </Box>
                  <Box className="DailySB-B6">
                    {bottomRightTab && Object.keys(imageData).length > 0 && imageData[bottomRightTab] != undefined && BottomRightOnSelectChang(bottomRightTab, 'Right')}
                    {BottomRightOnSelectTextChang()}
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
