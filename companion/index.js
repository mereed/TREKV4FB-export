
// Import modules
import Weather from '../common/weather/phone';
import * as messaging from "messaging";
import { settingsStorage } from "settings";

console.log("Companion Started");

// starting weather companion
let weather = new Weather();

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  // restoreSettings(); SETTINGS ARE RESTORED FROM THE WATCH ITSELF, NOT HERE
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  
  let data = {
    key: evt.key,
  };
  
 /* if (evt.key == "secondaryTimezone") { // if this is timezone data - getting realtime timezone
    
      // setting initial values
      data.newValue = {
        timezoneName: JSON.parse(evt.newValue).values[0].value.timezoneName,
        timezoneOffset: JSON.parse(evt.newValue).values[0].value.timezoneOffset
      }
    
      // getting realtime offset
       fetch('https://api.timezonedb.com/?' + JSON.parse(evt.newValue).values[0].value.timezoneCoordinates + '&key=2F2TELTVDRIB&format=json')
          .then((response) => {return response.json()})
          .then((tmz) => { // on success - asssigning new offset and sending to the watch
                data.newValue.timezoneOffset = parseInt(tmz.gmtOffset) / 60;
                console.log("Got offset: " + data.newValue.timezoneOffset);
                sendVal(data);
          })
          .catch((err) => {  // on error - sending value as is - with original value
              console.log("Got offset error: " + err);
              sendVal(data);
          });
    */
  //} else 
  { // otherwise sending data as is
      data.newValue = evt.newValue
      sendVal(data);
  }
  

};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}