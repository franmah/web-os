import { FC, Fragment } from "react";
import { leftMaximizeAnimation, maximizeAnimation, rightMaximizeAnimation } from "../../../../animations/windowMaximizeAnimations";
import { MaximizePlaceholderDirection } from "../window";
import styles from './animationPlaceholder.module.scss';

const WindowAnimationPlaceholderComponent: FC<{
  showMaximizePlacehodler: MaximizePlaceholderDirection,
  top: number,
  left: number,
  width: number,
  height: number
}> = ({ showMaximizePlacehodler, top, left, width, height }) => {
  return (
    <Fragment>
      <style children={`
        ${maximizeAnimation.animation(left, width, height)} 
        ${leftMaximizeAnimation.animation(top, height)} 
        ${rightMaximizeAnimation.animation(top, height)}
      `}/>

      {
        showMaximizePlacehodler === MaximizePlaceholderDirection.Full &&
        <div
          style={{ animationName: maximizeAnimation.name }}
          className={styles.maximizePlaceholderModal}
        >
        </div>
      }
      {
        showMaximizePlacehodler === MaximizePlaceholderDirection.Left && 
        <div 
          className={styles.leftSideMaximizePlaceholderModal} 
          style={{ animationName: leftMaximizeAnimation.name }}
        ></div>
      }
      { 
        showMaximizePlacehodler === MaximizePlaceholderDirection.Right &&
        <div 
          className={styles.rightSideMaximizePlaceholderModal}
          style={{ animationName: rightMaximizeAnimation.name }}
        ></div>
      }
    </Fragment>
  );
};

export default WindowAnimationPlaceholderComponent;