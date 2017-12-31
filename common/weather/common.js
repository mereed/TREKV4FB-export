export const Conditions = {
  ClearSky        : 0,
  FewClouds       : 1,
  ScatteredClouds : 2,
  BrokenClouds    : 3,
  ShowerRain      : 4,
  Rain            : 5,
  Thunderstorm    : 6,
  Snow            : 7,
  Mist            : 8,
  Unknown         : 1000,
};

export var WEATHER_MESSAGE_KEY = "my_awesome_weather_message";

export const weather_icon = {
  day: {
    0: 'clearsky.png',
    1: 'fewclouds.png',
    2: 'pcday.png',
    3: 'clouds.png',
    4: 'rain.png',
    5: 'hail.png',
    6: 'thunderstorms.png',
    7: 'snow.png',
    8: 'mist.png' ,
    1000: 'unknown.png'
  },
  
  night: {
    0: 'clearnight.png',
    1: 'pcnight.png',
    2: 'pcnight2.png',
    3: 'clouds.png',
    4: 'rain.png',
    5: 'hail.png',
    6: 'thunderstorms.png',
    7: 'snow.png',
    8: 'mist.png',
    1000: 'unknown.png'
  }
}
