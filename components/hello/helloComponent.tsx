import { FC } from "react"
import styles from "./hello.module.scss";

const HelloComponent: FC<{ params: any }> = ({ params }) => {
  return (
    <iframe
      className={styles.video}
      width='100%' 
      height='100%'
      src="https://www.youtube.com/embed/XXYlFuWEuKI"
      title="YouTube video player"
      allowFullScreen
    ></iframe>
  );
};

export default HelloComponent;