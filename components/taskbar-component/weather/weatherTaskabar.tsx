import { FC, useEffect, useState } from "react";
import { getWeatherInformation } from "../../../services/WeatherService";
import { BiFoodMenu } from 'react-icons/bi';
import styles from './weather.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import Image from 'next/image';
import { Weather } from "../../../types/taskbar/weather";

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
    <section className={`${styles.weatherTaskbar} ${globalStyles.unselectableText}`}>
      { 
        weather ?
         (
          <div className={styles.weather}>

            <Image className={styles.weatherIcon} src={weather.icon} alt='weather' width={28} height={28}/>

            <div className={styles.weatherInfo}>
              <div> {weather.temperature}°{weather.temperatureUnit} </div>
              <div className={styles.forecast}> {weather.forecast} </div>
            </div>

          </div>
        ) :

        <BiFoodMenu size={26} className={styles.placeholderIcon} />
      }
    </section>
  )
};

export default WeatherComponent;