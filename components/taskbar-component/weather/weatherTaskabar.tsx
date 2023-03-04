import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { getWeatherInformation, Weather } from "../../../services/WeatherService";
import styles from './weather.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import Image from 'next/image';


const WeatherComponent: FC<{}> = () => {

  const [weather, setWeather] = useState<Weather | null>(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      onCurrentPositionAllowed,
      (error) => console.warn(error)
    );
  }, []);
  
  const onCurrentPositionAllowed = useCallback(async (position: any) => {
    const latitude = position?.coords?.latitude;
    const longitude = position?.coords?.longitude;
    const weatherData = await getWeatherInformation(latitude, longitude)
    setWeather(weatherData);
  }, []);
  
  return (
    <Fragment>
      { 
        weather && (
          <section className={`${styles.weatherTaskbar} ${globalStyles.unselectableText}`}>

            <Image src={weather.icon} alt='weather' width={28} height={28}/>

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