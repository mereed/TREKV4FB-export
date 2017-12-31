// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Format time for non 12h Display and fix 0:00 at midnight
import userSettings from "user-settings";
export function formatHours(hours) {
  if (userSettings.preferences.clockDisplay == "12h" && hours > 12) hours-=12;
  if (userSettings.preferences.clockDisplay == "12h" && hours == 0) hours = 12;
  return hours;
}

// Get Today's Steps
export function getSteps(steps) {
  if (steps == "" || steps == "null" || steps == "undefined" || steps == undefined) {
    steps = "0";  
    return steps;
  } else {
    return steps;
  }
}