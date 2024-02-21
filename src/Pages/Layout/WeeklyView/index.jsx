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
//Component 

export default function Layout({ updatePriceBox }) {


  const dayOptions = { weekday: 'long' };
  const MonthOptions = { month: 'long' };

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Calculate the difference to Monday
  const startDate = new Date(today); // Clone today's date
  startDate.setDate(today.getDate() - diff); // Calculate the start date of the week
  const StartCMonth = startDate.toLocaleDateString('en-US', MonthOptions);
  const StartCDate = startDate.getDate();

  // Calculate the end date by adding 6 days to the start date
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  const EndCMonth = endDate.toLocaleDateString('en-US', MonthOptions);
  const EndCDate = endDate.getDate();



  const nextDayDates = [];
  // Loop to get the next 6 dates
  for (let i = 0; i <= 7; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + i);

    const dayName = nextDate.toLocaleDateString('en-US', dayOptions);
    const dayOfMonth = nextDate.getDate();;

    nextDayDates.push({ 'dayOfMonth': dayOfMonth, dayName: dayName });
  }


  const [layoutData, setLayoutData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const [imageData, setImageData] = useState([])
  const [sectionOptData, setSectionOptData] = useState("")
  const [quoteData, setQuoteData] = useState([])
  const [priceBox, setPriceBox] = useState(1);

  const [layoutTab, setLayoutTab] = useState()
  const [selectedTime, setSelectedTime] = useState("")
  const [timeClass, setTimeClass] = useState("")

  const [timeBox, setTimeBox] = useState(true)
  const [rightCustomBox1, setRightCustomBox1] = useState(true)
  const [rightCustomBox2, setRightCustomBox2] = useState(true)
  const [rightCustomBox3, setRightCustomBox3] = useState(true)
  const [rightCustomBox4, setRightCustomBox4] = useState(true)
  const [rightCustomBox5, setRightCustomBox5] = useState(true)
  const [customOption, setCustomOption] = useState(false);


  const [layoutBlock1, setLayoutBlock1] = useState(193);
  const [layoutBlock2, setLayoutBlock2] = useState(194);

  const [rightCustomRadio1, setRightCustomRadio1] = useState(0)
  const [rightCustomRadio1Text, setRightCustomRadio1Text] = useState("")

  const [rightCustomRadio2, setRightCustomRadio2] = useState(0)
  const [rightCustomRadio2Text, setRightCustomRadio2Text] = useState("")

  const [rightCustomRadio3, setRightCustomRadio3] = useState(0)
  const [rightCustomRadio3Text, setRightCustomRadio3Text] = useState("")

  const [rightCustomRadio4, setRightCustomRadio4] = useState(0)
  const [rightCustomRadio4Text, setRightCustomRadio4Text] = useState("")

  const [rightCustomRadio5, setRightCustomRadio5] = useState(0)
  const [rightCustomRadio5Text, setRightCustomRadio5Text] = useState("")

  const [fullView, setFullView] = useState("")
  const [largeView, setLargeView] = useState(false)


  const handleLayoutChange = (layout) => {
    setLayoutTab(layout.id);

    {
      sectionData[layout.id].map((section, index) => {

        if (index === 0 && section.default_val > 0) {
          setSelectedTime(section.default_val);
        }
        if (index === 1 && section.default_val > 0) {
          setRightCustomRadio1(section.default_val);
        }
        if (index === 2 && section.default_val > 0) {
          setRightCustomRadio2(section.default_val);
        }
        if (index === 3 && section.default_val > 0) {
          setRightCustomRadio3(section.default_val);
        }
        if (index === 4 && section.default_val > 0) {
          setRightCustomRadio4(section.default_val);
        }
        if (index === 5 && section.default_val > 0) {
          setRightCustomRadio5(section.default_val);
        }
      })
    }

    SetBlockId(layout.id);

  }

  const handleSecondTimeRadioChange = (event) => {
    const t = event.target.value;
    setSelectedTime(t);
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

  const SetBlockId = (layoutid) => {
    if (layoutid === 2) {
      setLayoutBlock1("193");
      setLayoutBlock2("194");
    }
    if (layoutid === 1) {
      setLayoutBlock1("");
      setLayoutBlock2("192");
    }
    if (layoutid === 3) {
      setLayoutBlock1(195);
      setLayoutBlock2("");
    }
    if (layoutid === 4) {
      setLayoutBlock1("196");
      setLayoutBlock2("");
    }
  }

  useEffect(() => {
    const BACKEND_URL = config.BACKEND_URL;

    axios.get(`${BACKEND_URL}/api/V1/layout/WeeklyView`)
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
    var defaultLayout = "";
    layoutData.forEach((layout) => {
      if (layout.isDefault === 1) {
        setLayoutTab(layout.id)
        defaultLayout = layout.id;
        defaultParameters = { ...defaultParameters, layoutTab: layout.id };
        defaultParameters = { ...defaultParameters, layoutBlock1: 193 };
        defaultParameters = { ...defaultParameters, layoutBlock2: 194 };
      }
    });

    // Check if sectionData is available and not empty
    {
      Object.keys(sectionData).map((layoutId) => {
        {
          sectionData[layoutId].map((section, index) => {

            // Check index and default_val for each section and update state accordingly
            if (layoutId == defaultLayout && index === 0 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, selectedTime: parseInt(section.default_val) };
            }
            if (layoutId == defaultLayout && index === 1 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, rightCustomRadio1: parseInt(section.default_val) };
            }
            if (layoutId == defaultLayout && index === 2 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, rightCustomRadio2: parseInt(section.default_val) };
            }
            if (layoutId == defaultLayout && index === 3 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, rightCustomRadio3: parseInt(section.default_val) };
            }
            if (layoutId == defaultLayout && index === 4 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, rightCustomRadio4: parseInt(section.default_val) };
            }
            if (layoutId == defaultLayout && index === 5 && section.default_val > 0) {
              defaultParameters = { ...defaultParameters, rightCustomRadio5: parseInt(section.default_val) };
            }

          })
        };

      })
    }


    //getting session data
    var sessionData = JSON.parse(sessionStorage.getItem("Layout"));
    if (sessionData !== null) {
      const WeeklyViewData = sessionData.WeeklyView;
      if (WeeklyViewData !== undefined) {
        sessionData = WeeklyViewData;
      }
    }

    // Merge default parameters with session data
    const mergedData = { ...defaultParameters, ...sessionData };

    setLayoutTab(mergedData.layoutTab);
    setSelectedTime(mergedData.selectedTime);
    setLayoutBlock1(mergedData.layoutBlock1);
    setLayoutBlock2(mergedData.layoutBlock2);

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

    if (NewLayoutData !== null && NewLayoutData['WeeklyView'] !== undefined) {

      const WeeklyViewData = {
        layoutTab: layoutTab,
        selectedTime: selectedTime,
        layoutBlock1: layoutBlock1,
        layoutBlock2: layoutBlock2,
        rightCustomRadio1: rightCustomRadio1,
        rightCustomRadio1Text: rightCustomRadio1Text,
        rightCustomRadio2: rightCustomRadio2,
        rightCustomRadio2Text: rightCustomRadio2Text,
        rightCustomRadio3: rightCustomRadio3,
        rightCustomRadio3Text: rightCustomRadio3Text,
        rightCustomRadio4: rightCustomRadio4,
        rightCustomRadio4Text: rightCustomRadio4Text,
        rightCustomRadio5: rightCustomRadio5,
        rightCustomRadio5Text: rightCustomRadio5Text,
      };
      NewLayoutData['WeeklyView'] = WeeklyViewData;
      sessionStorage.setItem("Layout", JSON.stringify(NewLayoutData));
    } else {
      sessionStorage.setItem("Layout", JSON.stringify({ WeeklyView: [] }));
    }

    updatePriceBox(priceBox + 1);

  }, [layoutTab, selectedTime, layoutBlock1, layoutBlock2, rightCustomRadio1, rightCustomRadio2, rightCustomRadio3, rightCustomRadio4, rightCustomRadio5, rightCustomRadio1Text, rightCustomRadio2Text, rightCustomRadio3Text, rightCustomRadio4Text, rightCustomRadio5Text])

  useEffect(() => {
    if (selectedTime == 137 || selectedTime == 157 || selectedTime == 173 || selectedTime == 179 || selectedTime == 185 || selectedTime == 191) {
      setTimeClass("BlockTime")
    } else {
      setTimeClass("")
    }
  }, [selectedTime])

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

  const LayoutBox = ({ layout, index }) => {
    return (
      <Box key={`layout-${index}`} onClick={() => handleLayoutChange(layout)} className={layoutTab === layout.id ? "timeBoxItemWeekly  timeBoxItemActive" : "timeBoxItemWeekly "}>
        <Box className={layoutTab === layout.id ? "timeSBoxActive timeSBox" : "timeSBox"}></Box>
        <Typography>{layout.title}</Typography>
      </Box>
    )
  }

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
    console.log(type, newQuoteData.length, randomIndex)
    // Mark the selected quote as used
    usedQuotes[type].push(selectedQuote);

    return selectedQuote;
  }

  /*function getQuoteContent2(type) {
    const newQuoteData = quoteData.filter((item) => item.type === type);
    console.log(type,newQuoteData.length)
    const randomIndex = Math.floor(Math.random() * newQuoteData.length);
    return newQuoteData[randomIndex];
  }*/


  const RightBoxOnSelectImgChang = (id, type) => {
    var imgid = parseInt(id);

    if (imgid == 139 || imgid == 159 || imgid == 310) {
      //for  Quote
      var quote = getQuoteContent(2);
      return <Box className={`QuoteContainer QuoteOnly`}><Typography className='QuoteText'>{quote.quote_text}</Typography><Typography className='author'>{quote.author}</Typography></Box>;
    } else if (imgid == 290) {
      var quote = getQuoteContent(3);
      return <Box className={`QuoteContainer QuoteOnly QC-290`}><Typography className='QuoteText'>{quote.quote_text}</Typography><Typography className='author'>{quote.author}</Typography></Box>;
    } else if (imgid == 198 || imgid== 317) {
      var quote = getQuoteContent(1);
      return <Box className={`QuoteContainer QC-198`}><Typography className='QuoteText'>{quote.quote_text}</Typography><Typography className='author'>{quote.author}</Typography></Box>;
    } else {
      if (type == "Right") {
        return <img className='PageSubImages' src={imageData[imgid].right_image} alt='' />;
      } else {
        return <img className='PageSubImages' src={imageData[imgid].left_image} alt='' />;
      }
    }

  }
  const RightBoxOnSelectTextChang = (Radio, RadioText) => {
    let text;
   
    switch (parseInt(Radio)) {
      case 145:
      case 146:
      case 151:
      case 165:
      case 166:
      case 167:
      case 313:
      case 314:
      case 315:
        text = RadioText
        break;
      default:
        text = ''
        break;
    }

    return <Typography className='WeeklyViewCustomText'>{text}</Typography>;
  }


  return (
    <>

      <Box className={fullView ? 'PageInnerBox fullexpand' : 'PageInnerBox'}>
        <Box className="LeftPanelBox">
          <Box className="LeftHeader">
            <Typography className='LeftTitle'>Weekly View</Typography>
          </Box>

          <Box className="LeftInner">
            {layoutData.map((layout, index) => (
              index % 2 === 0 && layoutData[`${index + 1}`] ? (
                <Box mb={2} key={`layoutBox-${index}`} className="timeBox 1">
                  <LayoutBox key={`layout-${index}`} layout={layout} index={index} />
                  <LayoutBox key={`layout-${index + 1}`} layout={layoutData[`${index + 1}`]} index={index + 1} />
                </Box>
              ) : null
            ))}



            <Box className="preweek-para">
              <Typography >*You can use a Do What Matters Most bookmark that comes with your planner (for free) to do pre-week planning, or you can include a pre-week planning table in your planner.</Typography>
            </Box>

            {/* Blocks for HorizontalWithPreWeekoutPreWeek */}
            <Box className="sideChangeableTab">
              <Box onClick={() => setCustomOption(!customOption)} mb={2} className="customOption">
                <Typography pl={2}>Custom Options</Typography>
                <img onClick={() => setCustomOption(!customOption)} className='customOptionDownArrow' src={customOption ? UpArrow : DownArrow} />

              </Box>




              <Box sx={{ display: customOption ? "block" : "none" }} >

                {Object.keys(sectionData).map((layoutId, index) => {
                  const timeId = sectionData[layoutId][0]['clone_section'] ? sectionData[layoutId][0]['clone_section'] : sectionData[layoutId][0]['id'];
                  const radioId1 = sectionData[layoutId][1]['clone_section'] ? sectionData[layoutId][1]['clone_section'] : sectionData[layoutId][1]['id'];
                  const radioId2 = sectionData[layoutId][2]['clone_section'] ? sectionData[layoutId][2]['clone_section'] : sectionData[layoutId][2]['id'];
                  const radioId3 = sectionData[layoutId][3]['clone_section'] ? sectionData[layoutId][3]['clone_section'] : sectionData[layoutId][3]['id'];
                  const radioId4 = sectionData[layoutId][4]['clone_section'] ? sectionData[layoutId][4]['clone_section'] : sectionData[layoutId][4]['id'];
                  const radioId5 = sectionData[layoutId].length > 5 ? sectionData[layoutId][5]['clone_section'] ? sectionData[layoutId][5]['clone_section'] : sectionData[layoutId][5]['id'] : 0;

                  return (
                    <Box key={`section-${index}`} sx={{ display: layoutTab == layoutId ? 'block' : 'none' }} >

                      {/* Time Box */}
                      <Box mb={2} className={timeBox ? "customPageTabBox" : "customPageTabBox customPageTabCloseBox x2"}>
                        <img onClick={() => setTimeBox(timeBox ? null : "Time")} className='leftCustomArrow' src={timeBox ? UpArrow : DownArrow} alt='' />
                        <Box mb={timeBox ? 0 : 5} className="customPageBoxHeader">
                          <Typography onClick={() => setTimeBox(timeBox ? null : "Time")} className='BoxHeaderText'>
                            {sectionData[layoutId][0].section_title}</Typography>
                        </Box>
                        <Box className="customRadioBox">
                          {sectionOptData[timeId] && sectionOptData[timeId].map((timesec, index) => (
                            index % 2 === 0 && sectionOptData[timeId][index + 1] ? (
                              <Box key={`time-${index}`} className="setWeeklyTimeInsideBox">
                                <TimeBox timeData={timesec} index={index} />
                                <TimeBox timeData={sectionOptData[timeId][index + 1]} index={index + 1} />
                              </Box>
                            ) : null
                          ))}
                        </Box>
                      </Box>

                      <Box mb={2} className={rightCustomBox1 ? "customPageTabBox customPageTabCloseBox x2" : "customPageTabBox"}>
                        <img onClick={() => setRightCustomBox1(!rightCustomBox1)} className='leftCustomArrow' src={rightCustomBox1 ? UpArrow : DownArrow} />
                        <Box mb={rightCustomBox1 ? 5 : 0} className="customPageBoxHeader">
                          <Typography onClick={() => setRightCustomBox1(!rightCustomBox1)} className='BoxHeaderText'>{sectionData[layoutId][1].section_title}</Typography>
                        </Box>
                        <Box className="customRadioBox">
                          {sectionOptData[radioId1] && sectionOptData[radioId1].map((optData1, index) => (
                            <Box key={`CustomRadio2-${index}`}>
                              <Box className="customRadioInputBox">
                                <label className='radioLabel' >
                                  <Radio
                                    sx={{
                                      color: '#B8845F',
                                      '&.Mui-checked': {
                                        color: '#B8845F',
                                      },
                                    }}
                                    name={`CustomRadio1-${index}`}
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

                      <Box mb={2} className={rightCustomBox2 ? "customPageTabBox customPageTabCloseBox x2" : "customPageTabBox"}>
                        <img onClick={() => setRightCustomBox2(!rightCustomBox2)} className='leftCustomArrow' src={rightCustomBox2 ? UpArrow : DownArrow} />
                        <Box mb={rightCustomBox2 ? 5 : 0} className="customPageBoxHeader">
                          <Typography onClick={() => setRightCustomBox2(!rightCustomBox2)} className='BoxHeaderText'>{sectionData[layoutId][2].section_title}</Typography>
                        </Box>
                        <Box className="customRadioBox">
                          {sectionOptData[radioId2] && sectionOptData[radioId2].map((optData2, index) => (
                            <Box key={`CustomRadio2-${index}`}>
                              <Box key={`CustomRadio2-${index}`} className="customRadioInputBox">
                                <label className='radioLabel' >
                                  <Radio
                                    sx={{
                                      color: '#B8845F',
                                      '&.Mui-checked': {
                                        color: '#B8845F',
                                      },
                                    }}
                                    name={`CustomRadio2-${index}`}
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

                      <Box mb={2} className={rightCustomBox3 ? "customPageTabBox customPageTabCloseBox x2" : "customPageTabBox"}>
                        <img onClick={() => setRightCustomBox3(!rightCustomBox3)} className='leftCustomArrow' src={rightCustomBox3 ? UpArrow : DownArrow} />
                        <Box mb={rightCustomBox3 ? 5 : 0} className="customPageBoxHeader">
                          <Typography onClick={() => setRightCustomBox3(!rightCustomBox3)} className='BoxHeaderText'>{sectionData[layoutId][3].section_title}</Typography>
                        </Box>
                        <Box className="customRadioBox">
                          {sectionOptData[radioId3] && sectionOptData[radioId3].map((optData3, index) => (
                            <Box key={`CustomRadio3-${index}`}>
                              <Box className="customRadioInputBox">
                                <label className='radioLabel' >
                                  <Radio
                                    sx={{
                                      color: '#B8845F',
                                      '&.Mui-checked': {
                                        color: '#B8845F',
                                      },
                                    }}
                                    name={`CustomRadio3-${index}`}
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

                      <Box mb={2} className={rightCustomBox4 ? "customPageTabBox customPageTabCloseBox x2" : "customPageTabBox"}>
                        <img onClick={() => setRightCustomBox4(!rightCustomBox4)} className='leftCustomArrow' src={rightCustomBox4 ? UpArrow : DownArrow} />
                        <Box mb={rightCustomBox4 ? 5 : 0} className="customPageBoxHeader">
                          <Typography onClick={() => setRightCustomBox4(!rightCustomBox4)} className='BoxHeaderText'>{sectionData[layoutId][4].section_title}</Typography>
                        </Box>
                        <Box className="customRadioBox">
                          {sectionOptData[radioId4] && sectionOptData[radioId4].map((optData4, index) => (
                            <Box key={`CustomRadio4-${index}`}>
                              <Box className="customRadioInputBox">
                                <label className='radioLabel' >
                                  <Radio
                                    sx={{
                                      color: '#B8845F',
                                      '&.Mui-checked': {
                                        color: '#B8845F',
                                      },
                                    }}
                                    name={`CustomRadio4-${index}`}
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

                      {sectionData[layoutId].length > 5 && (
                        <Box mb={2} className={rightCustomBox5 ? "customPageTabBox customPageTabCloseBox x2" : "customPageTabBox"}>
                          <img onClick={() => setRightCustomBox5(!rightCustomBox5)} className='leftCustomArrow' src={rightCustomBox5 ? UpArrow : DownArrow} />
                          <Box mb={rightCustomBox5 ? 5 : 0} className="customPageBoxHeader">
                            <Typography onClick={() => setRightCustomBox5(!rightCustomBox5)} className='BoxHeaderText'>{sectionData[layoutId][5].section_title}</Typography>
                          </Box>
                          <Box className="customRadioBox">
                            {sectionOptData[radioId5] && sectionOptData[radioId5].map((optData5, index) => (
                              <Box key={`CustomRadio5-${index}`}>
                                <Box key={`CustomRadio5-${index}`} className="customRadioInputBox">
                                  <label className='radioLabel' >
                                    <Radio
                                      sx={{
                                        color: '#B8845F',
                                        '&.Mui-checked': {
                                          color: '#B8845F',
                                        },
                                      }}
                                      name={`CustomRadio5-${index}`}
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
                        </Box>)}



                    </Box>
                  )
                })}




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
            <Box mt={3} className={`PreviewContainer T${layoutTab} ${timeClass}`}>
              <img src={DiaryBaseImage} className='diray_base' alt="" />
              <Box className="diray_inner">
                <Box className="diray_page leftpage">

                  <Box className="WeeklyView-B0 LPLeft">
                    {(StartCMonth != EndCMonth) ? (
                      <>
                        <Typography className="WeeklyDateBTitle">{StartCMonth}</Typography>
                        <Typography className="WeeklyDateBTitle" ml={1} mr={1}>{StartCDate} - </Typography>
                        <Typography className="WeeklyDateBTitle">{EndCMonth}</Typography>
                        <Typography className="WeeklyDateBTitle" ml={1}>{EndCDate}</Typography>
                      </>
                    ) : (
                      <>
                        <Typography className="WeeklyDateBTitle">{StartCMonth}</Typography>
                        <Typography className="WeeklyDateBTitle" ml={1}>{StartCDate} - {EndCDate}</Typography>
                      </>
                    )}
                  </Box>
                  <Box className="WeeklyView-B1 LPRight">
                    {rightCustomRadio1 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio1] != undefined && RightBoxOnSelectImgChang(rightCustomRadio1, 'Left')}
                    {RightBoxOnSelectTextChang(rightCustomRadio1, rightCustomRadio1Text)}
                  </Box>
                  <Box className="WeeklyView-B2 LPLeft">
                    {layoutBlock1 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[layoutBlock1].left_image} alt='' />)}
                  </Box>
                  <Box className="WeeklyView-B3-left LPLeft">
                    {layoutBlock2 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[layoutBlock2].left_image} alt='' />)}
                  </Box>

                  <Box className='WeeklyView-B3 LPRight'>
                    {selectedTime > 0 && Object.keys(imageData).length > 0 && imageData[selectedTime] != undefined && (<img className="PageSubImages" src={imageData[selectedTime].left_image} alt='' />)}
                    <Box class="d1">
                      <Typography className="WeeklyDateDTitle">{nextDayDates[0].dayOfMonth}</Typography>
                      <Typography className="WeeklyDateNTitle">{nextDayDates[0].dayName}</Typography>
                    </Box>
                    <Box class="d2">
                      <Typography className="WeeklyDateDTitle">{nextDayDates[1].dayOfMonth}</Typography>
                      <Typography className="WeeklyDateNTitle">{nextDayDates[1].dayName}</Typography>
                    </Box>
                    <Box class="d3">
                      <Typography className="WeeklyDateDTitle">{nextDayDates[2].dayOfMonth}</Typography>
                      <Typography className="WeeklyDateNTitle">{nextDayDates[2].dayName}</Typography>
                    </Box>
                    <Box class="d4">
                      <Typography className="WeeklyDateDTitle">{nextDayDates[3].dayOfMonth}</Typography>
                      <Typography className="WeeklyDateNTitle">{nextDayDates[3].dayName}</Typography>
                    </Box>
                  </Box>
                  <Box className='WeeklyView-B4 LPLeft PBottom'>
                    {rightCustomRadio2 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio2] != undefined && RightBoxOnSelectImgChang(rightCustomRadio2, 'Left')}
                    {RightBoxOnSelectTextChang(rightCustomRadio2, rightCustomRadio2Text)}
                  </Box>
                  <Box className='WeeklyView-B5 LPRight PBottom'>
                    {rightCustomRadio3 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio3] != undefined && RightBoxOnSelectImgChang(rightCustomRadio3, 'Left')}
                    {RightBoxOnSelectTextChang(rightCustomRadio3, rightCustomRadio3Text)}
                  </Box>

                </Box>
                <Box className="diray_page rightpage">
                  <img className='insideCover_binder' src={InsideCoverBinder} alt='' />

                  <Box className="WeeklyView-B6 RPLeft">
                    {layoutTab !== 6 && rightCustomRadio2 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio4] != undefined && RightBoxOnSelectImgChang(rightCustomRadio2, 'Right')}
                    {layoutTab !== 6 && RightBoxOnSelectTextChang(rightCustomRadio2, rightCustomRadio2Text)}
                    {layoutTab === 6 && rightCustomRadio1 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio5] != undefined && RightBoxOnSelectImgChang(rightCustomRadio1, 'Right')}
                    {layoutTab === 6 && RightBoxOnSelectTextChang(rightCustomRadio1, rightCustomRadio1Text)}
                  </Box>
                  <Box className="WeeklyView-B7 RPRight">
                    {rightCustomRadio3 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio3] != undefined && RightBoxOnSelectImgChang(rightCustomRadio3, 'Right')}
                    {RightBoxOnSelectTextChang(rightCustomRadio3, rightCustomRadio3Text)}
                  </Box>
                  <Box className="WeeklyView-B8 RPLeft">
                    {layoutBlock1 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[layoutBlock1].right_image} alt='' />)}
                  </Box>
                  <Box className="WeeklyView-B9 RPLeft">
                    {selectedTime > 0 && Object.keys(imageData).length > 0 && imageData[selectedTime] != undefined && (<img className="PageSubImages" src={imageData[selectedTime].right_image} alt='' />)}
                    <Box class="d5">
                      <Typography className="WeeklyDateNTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[4].dayName : nextDayDates[3].dayName}</Typography>
                      <Typography className="WeeklyDateDTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[4].dayOfMonth : nextDayDates[3].dayOfMonth}</Typography>
                    </Box>
                    <Box class="d6">
                      <Typography className="WeeklyDateNTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[5].dayName : nextDayDates[4].dayName}</Typography>
                      <Typography className="WeeklyDateDTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[5].dayOfMonth : nextDayDates[4].dayOfMonth}</Typography>
                    </Box>
                    <Box class="d7">
                      <Typography className="WeeklyDateNTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[6].dayName : nextDayDates[5].dayName}</Typography>
                      <Typography className="WeeklyDateDTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[6].dayOfMonth : nextDayDates[5].dayOfMonth}</Typography>
                    </Box>
                    <Box class="d8">
                      <Typography className="WeeklyDateNTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[7].dayName : nextDayDates[6].dayName}</Typography>
                      <Typography className="WeeklyDateDTitle">{(layoutTab == 1 || layoutTab == 6) ? nextDayDates[7].dayOfMonth : nextDayDates[6].dayOfMonth}</Typography>
                    </Box>
                  </Box>
                  <Box className="WeeklyView-B9-right RPRight">
                    {layoutBlock2 > 0 && Object.keys(imageData).length > 0 && (<img className='PageSubImages' src={imageData[layoutBlock2].right_image} alt='' />)}
                  </Box>
                  <Box className="WeeklyView-B10 RPRight PBottom">
                    {rightCustomRadio4 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio4] != undefined && RightBoxOnSelectImgChang(rightCustomRadio4, 'Right')}
                    {RightBoxOnSelectTextChang(rightCustomRadio4, rightCustomRadio4Text)}
                  </Box>
                  <Box className="WeeklyView-B11 RPRight  PBottom">
                    {rightCustomRadio5 > 0 && Object.keys(imageData).length > 0 && imageData[rightCustomRadio5] != undefined && RightBoxOnSelectImgChang(rightCustomRadio5, 'Right')}
                    {RightBoxOnSelectTextChang(rightCustomRadio5, rightCustomRadio5Text)}
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
