export type Weather = {
  temperature: string;
  temperatureUnit: string;
  forecast: string;

};

export const getWeatherInformation = async (latitude: number, longitude: number): Promise<Weather> => {
  try {
    const res = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    const data = await res.json();

    const forecastLink = data.properties.forecast;
    const forecastRes = await fetch(forecastLink);
    const forecast = await forecastRes.json();
    const todayForecast = forecast.properties.periods[0];

    return {
      temperature: todayForecast.temperature,
      temperatureUnit: todayForecast.temperatureUnit,
      forecast: todayForecast.shortForecast
    };
  } catch (error) {
    console.error(`Error getting weather information: ${error}`);
    return Promise.reject();
  }
};