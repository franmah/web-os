import { FC, Fragment, useEffect, useState } from "react";
import { getWeatherInformation, Weather } from "../../../services/WeatherService";
import styles from './weather.module.scss';
import { IoIosPartlySunny } from 'react-icons/io';
import globalStyles from '../../../styles/global.module.scss';

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
          <section className={`${styles.weatherTaskbar} ${globalStyles.unselectableText}`}>

            <IoIosPartlySunny size={28} style={{ color: 'rgba(255, 217, 0, 0.96)'}}/>

            <div className={styles.weatherInfo}>
              <div> {weather.temperature}°{weather.temperatureUnit} </div>
              <div className={styles.forecast}> {weather.forecast} </div>
            </div>

          </section>
        )
      }
    </Fragment>
  )
};

export default WeatherComponent;