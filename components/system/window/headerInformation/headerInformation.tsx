import { FC } from "react";
import Image from 'next/image';
import { WindowHeaderOptions } from "../../../../types/system/window/WindowHeaderOptions";
import styles from './headerInformation.module.scss';

export const WindowHeaderInformationComponent: FC<{
  options: WindowHeaderOptions,
  focused: boolean,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void
}> = ({ options, focused, startMovingWindow, maximizeWindow }) => {

  const getTextClassName = () => {
    return `
      ${styles.textContainer} 
      ${focused ? styles.unfocusedText : ''}
    `;
  }
  return (
    <>
      {
        options?.icon &&
        <Image
          className={styles.icon}
          src={options?.icon} 
          alt={'window name'} 
          width={24} 
          height={24}
        />
      }

      <div 
        className={getTextClassName()}
        onMouseDown={startMovingWindow}
        onDoubleClick={maximizeWindow}
      >
        { options?.text }
      </div>
    </>
  );
}