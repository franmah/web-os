import { FC, Fragment, useEffect, useState } from "react";
import { getWeatherInformation, Weather } from "../../../services/WeatherService";
import styles from './weather.module.scss';

const WeatherComponent: FC<{}> = () => {

  const [weather, setWeather] = useState<Weather | null>(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      onCurrentPositionAllowed,
      (error) => console.warn(error)
    );
  }, []);
  
  const onCurrentPositionAllowed = async (position: any) => {
    const latitude = position?.coords?.latitude;
    const longitude = position?.coords?.longitude;
    const weatherData = await getWeatherInformation(latitude, longitude)
    setWeather(weatherData);
  };
  
  return (
    <Fragment>
      { 
        weather && (
          <div className={styles.weatherTaskabar}>
            <div> {weather.forecast} </div>
            <div> {weather.temperature} </div>
          </div>
        )
      }
    </Fragment>
  )
};

export default WeatherComponent;