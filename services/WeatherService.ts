import { weatherCodeLookupDay, weatherCodeLookupNight } from "../constants/weatherCodes";
import { Weather } from "../types/taskbar/weather";

const BASE_URL = 'http://api.weatherapi.com/v1/forecast.json?key=f34bddabceab41c2a0900913230403&days=1&aqi=no&alerts=no&q=';

export const getWeatherInformation = async (latitude: number, longitude: number): Promise<Weather> => {
  try {

    const url = BASE_URL + latitude + ',' + longitude;
    const res = await fetch(url);
    const data = await res.json();

    const temperature = data?.current?.temp_f;
    const temperatureUnit = 'F';
    const code: number = data?.current?.condition?.code;
    const isDay = data?.current?.is_day;

    const codeData: any = isDay ? weatherCodeLookupDay[code] : weatherCodeLookupNight[code];

    // Icon credit
    console.log('Icons provided by Dorava: https://www.dovora.com/resources/weather-icons/ under creative commons license: https://creativecommons.org/licenses/by-sa/4.0/');

    return {
      temperature,
      temperatureUnit,
      forecast: codeData.forecast,
      icon: codeData.icon
    };

  } catch (error) {
    console.error(`Error getting weather information: ${error}`);
    return Promise.reject();
  }
};