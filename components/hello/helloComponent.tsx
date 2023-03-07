import { FC } from "react"
import styles from "./hello.module.scss";

const HelloComponent: FC = () => {
  return (
    <iframe
      className={styles.video}
      width='100%' 
      height='100%'
      src="https://www.youtube.com/embed/XXYlFuWEuKI"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
};

export default HelloComponent;