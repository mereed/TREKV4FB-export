//importing libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";

import { charger, battery } from "power";
//console.log(Math.floor(battery.chargeLevel) + "%");
//console.log("The charger " + (charger.connected ? "is" : "is not") + " connected");

import Weather from '../common/weather/device';
import {weather_icon } from '../common/weather/common.js';
import userActivity from "user-activity";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";

// TIME
let separator = document.getElementById("separator");
let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");
var clockInterval;
var timer;

// DATE
let day = document.getElementById("day");
let month = document.getElementById("month");
let date1 = document.getElementById("date1");
let date2 = document.getElementById("date2");

//YEAR
let year1 = document.getElementById("year1");
let year2 = document.getElementById("year2");
let year3 = document.getElementById("year3");
let year4 = document.getElementById("year4");
 
// HRM
let hrm0 = document.getElementById("hrm0");
let hrm1 = document.getElementById("hrm1");
let hrm2 = document.getElementById("hrm2");
let heart = document.getElementById("heart");
let tinyheart = document.getElementById("tinyheart");
var hrm = new HeartRateSensor();
var showHeart = true;

//STEPS
let nosteps = document.getElementById("nosteps");
let step0 = document.getElementById("step0");
let step1 = document.getElementById("step1");
let step2 = document.getElementById("step2");
let step3 = document.getElementById("step3");
let step4 = document.getElementById("step4");

let batteryBar = document.getElementById("batteryBar");
let batteryBackground = document.getElementById("batteryBackground");
let batterytext = document.getElementById("batterytext");
let icon = document.getElementById("icon");
let temp = document.getElementById("temp");

// Don't start with a blank screen
updateClock();

batterytext.text = (Math.floor(battery.chargeLevel) + "%"); // working

//updateBattery();

clockInterval = setInterval(updateClock,1000);

// Begin monitoring the sensor
hrm.start();


// trying to get user settings if saved before
let userSettings;
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
  //restoring previous weather
  icon.href = userSettings.iconHref;
  temp.text = userSettings.tempText;
  
} catch (e) {
  userSettings = {
    weatherInterval: 120, // update weather every 2 hours
    weatherTemperature: "C", // display temperature in Fahrenheit
  }
}

// on app exit collect settings 
me.onunload = () => {
    fs.writeFileSync("user_settings.json", userSettings, "json");
}

// setting interval to fetch weather
let iWeatherInterval; 
function setWeatherInterval(interval) {
  clearInterval(iWeatherInterval);
  iWeatherInterval = setInterval(() => weather.fetch(), interval * 60 * 1000); 
}

//--- weather ---//

// Create the weather object
let weather = new Weather();

// Set the provider : yahoo / owm / wunderground / darksky
weather.setProvider("owm"); 
// set your api key
weather.setApiKey("a0bd96ff557605d53788170dd24531c1");
// set the maximum age of the data
weather.setMaximumAge(25 * 1000); 

// Display the weather data received from the companion
weather.onsuccess = (data) => {
  console.log("Weather on device " + JSON.stringify(data));
  icon.href =  weather_icon[data.isDay? "day" : "night"][data.conditionCode];

//setting temperature
  temp.text = (data[`temperature${userSettings.weatherTemperature}`]).toFixed(1) + "°";
  
  // preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.text;
  
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
  
  
// setting weather icon
  icon.href = "unknown.png";
  
//setting temperature
  temp.text = "---°"
  
// preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.text;
  
}

// on socket open - begin fetching weather
messaging.peerSocket.onopen = () => {
// kicking off weather updates
  console.log("App socket open")
  setWeatherInterval(userSettings.weatherInterval);
  weather.fetch(); 
}

// Message socket closes
messaging.peerSocket.onclose = () => {
  
}

messaging.peerSocket.onmessage  = evt =>  {
  
   switch (evt.data.key) {
     case "weatherInterval":
       userSettings.weatherInterval = JSON.parse(evt.data.newValue).values[0].value;
       setWeatherInterval(userSettings.weatherInterval);
       break;

     case "weatherTemperature":
       userSettings.weatherTemperature = JSON.parse(evt.data.newValue).values[0].value;
       weather.fetch();
       break;
   }
}

//------//


function updateBattery(charge) {
  batterytext.text = (Math.floor(battery.chargeLevel) + "%"); // working

  batteryBar.width = 44*charge/100;
    
//  if (charge < 20) {
//      batteryBar = "red";
//  } else if (charge < 50) {
//      batteryBar = "darkorange";
//  } else {
//      batteryBar = "forestgreen";
//  }

}

function updateClock() {
  let d = new Date();

  if(clockInterval == 0) {
    clearTimeout(timer);
    // Set the timeout according to how many seconds are remaining in a minute.
    // This guarantees the time update happens at the correct moment.
    timer = setTimeout(updateClock, (60-d.getSeconds())*1000);
  }
  
  // STEPS
  let stepsToday = util.getSteps(userActivity.today.local.steps);
  setSteps(stepsToday);

  // HOURS
  let hour = ("0" + util.formatHours(d.getHours())).slice(-2);
  setHours(hour);

  // MINUTES
  let minute = ("0" + d.getMinutes()).slice(-2);
  setMins(minute);
  
  // DATE
  setDate(d.getDate());
  
  // DAY NAME
  setDay(d.getDay());

  // MONTH
  setMonth(d.getMonth());

  // year
  setYear(d.getFullYear());

  
  // BLINK SEPARATOR
  setSeparator(d.getSeconds());

  // Heart Icon
  if (showHeart) {
    heart.style.display="inline";
    tinyheart.style.display="none";
    hrm0.style.display="none"
    hrm1.style.display="none"
    hrm2.style.display="none"
  } else {
    heart.style.display="none";
    tinyheart.style.display="inline";
  }
      updateBattery(Math.floor(battery.chargeLevel));

}

// Blink time separator
function setSeparator(val) {
  separator.style.display = (val % 2 == 0 ? "inline" : "none");
}

function setHours(val) {
  drawDigits("", val, hours1, hours2);
}

function setMins(val) {
  drawDigits("", val, mins1, mins2);
}

function setDate(val) {
  drawDigits("md-", val, date1, date2);
}

function setDay(val) {
  day.href = getDayImg(val);
}

function setYear(val) {
  drawDigits2("md-", val, year1, year2, year3, year4);
}

function setMonth(val) {
  month.href = getMonthImg(val);
}

function getDayImg(index) {
  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[index] + ".png";
}

function getMonthImg(index) {
  let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return months[index] + ".png";
}

function drawDigits(prefix, val, place1, place2) {
  place1.href = prefix + Math.floor(val / 10) + ".png";
  place2.href = prefix + Math.floor(val % 10) + ".png";
}

function drawDigits2(prefix, val, place_1, place_2, place_3, place_4) {
  place_1.href = prefix + Math.floor((val / 1000) % 10) + ".png";
  place_2.href = prefix + Math.floor((val / 100) % 10) + ".png";
  place_3.href = prefix + Math.floor((val / 10) % 10) + ".png";
  place_4.href = prefix + Math.floor(val % 10) + ".png";
}


// Draw Non-Time Digits to Screen
function draw5Digits(prefix, val, place1, place2, place3, place4, place5) {
  if(place1)
    place1.href = prefix + val.charAt(0) + ".png";
  if(place2)
    place2.href = prefix + val.charAt(1) + ".png";
  if(place3)
    place3.href = prefix + val.charAt(2) + ".png";
  if(place4)
    place4.href = prefix + val.charAt(3) + ".png";
  if(place5)
    place5.href = prefix + val.charAt(4) + ".png";
}

// Show/Hide the Step digits needed
function showStepBoxes(boxes) {
  var i;
  for (i = 0; i < arguments.length; i++) {
    let place = [step0, step1, step2, step3, step4];
    if(arguments[i] == 0) {
      if(place[i].style.display=="inline") {
        place[i].style.display="none";
      } else {
        place[i].style.display="none";
      }
    } else {
      if(place[i].style.display=="none") {
        place[i].style.display="inline";
      } else {
        place[i].style.display="inline";
      }
    }
  }
}

// Parse Step Data
function setSteps(val) {
   if(val == 0) {
      if(nosteps.style.display=="none")
      nosteps.style.display="inline";
     // This declares which digits to show from left to right or
     // reverse the order for right to left (HRM).
     // 0 = Off, 1 = On
      showStepBoxes(0,0,0,0,0);
    } else {
      if(nosteps.style.display=="inline")
      nosteps.style.display="none";
    }
  if(val.toString().length == 1) {
    if(val != 0)
    showStepBoxes(1,0,0,0,0);
      step0.href="md-" + val + ".png";
    } else if  (val.toString().length == 2) {
      showStepBoxes(1,1,0,0,0)
      draw5Digits("md-", val.toString(), step0, step1, null, null, null);
    } else if (val.toString().length == 3) {
    showStepBoxes(1,1,1,0,0);
    draw5Digits("md-", val.toString(), step0, step1, step2, null, null);
  } else if (val.toString().length == 4) {
    showStepBoxes(1,1,1,1,0);
    draw5Digits("md-", val.toString(), step0, step1, step2, step3, null);
  } else {
    showStepBoxes(1,1,1,1,1);
    draw5Digits("md-", val.toString(), step0, step1, step2, step3, step4);
  }
}

// Show/Hide Heart Digits
function showHeartBoxes(boxes) {
  var i;
  for (i = 0; i < arguments.length; i++) {
    let place = [hrm0, hrm1, hrm2];
    if(arguments[i] == 0) {
      if(place[i].style.display=="inline") {
        place[i].style.display="none";
      } else {
        place[i].style.display="none";
      }
    } else {
      if(place[i].style.display=="none") {
        place[i].style.display="inline";
      } else {
        place[i].style.display="inline";
      }
    }
  }
}

// Declare a event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  // Peek the current sensor values
  let val = hrm.heartRate.toString();
  if(hrm.heartRate > 1) {
    showHeart = false;
  } else {
    showHeart = true;
  }
  // Parse HRM data
  if (hrm.heartRate.length == 3) {
    showHeartBoxes(1,1,1);
    draw5Digits("md-", val.toString(), hrm0, hrm1, hrm2, null, null);
} else {
    showHeartBoxes(1,1,1);
    draw5Digits("md-", val.toString(), hrm0, hrm1, hrm2, null, null);
  }
}

// Check Display
display.addEventListener("change", function(){
  if(display.on) {
    // Set clock interval back to 1 second updates
    clearTimeout(timer);
    clearInterval(clockInterval);
    clockInterval = 0;
    clockInterval = setInterval(updateClock,1000);
 
//    updateBattery(Math.floor(battery.chargeLevel));

    updateClock();

    hrm.start();
  } else {
    // Morris hack: Set Clock to 1 minute updates to display the correct time when
    // display is turned back on. First we clear the interval and set it to 0 to
    // meet the timeout loop requirements to fire while the display is off.
    // (This is my low tech interpretation of Morris' more elegant approach)
    clearInterval(clockInterval);
    clockInterval = 0;
  
   // updateBattery(Math.floor(battery.chargeLevel));

    // Begin the 60 second timeout loop by calling updateClock now that clockInterval == 0
    updateClock();
    hrm.stop();
  }
// updateBattery(Math.floor(battery.chargeLevel));
  
//  updateBattery(Math.floor(Math.random()*101));


})