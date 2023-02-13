import { FC } from "react"
import styles from "./hello.module.scss";

const Hello: FC = () => {
  return (
    <div className={styles.hello}>Hello World</div>
  );
};

export default Hello;