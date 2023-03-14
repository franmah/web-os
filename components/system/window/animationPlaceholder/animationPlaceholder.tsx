import { FC, Fragment, memo } from "react";
import { heightMaximizeAnimation, leftMaximizeAnimation, maximizeAnimation, rightMaximizeAnimation } from "../../../../animations/windowMaximizeAnimations";
import { MaximizePlaceholderDirection } from "../window";
import styles from './animationPlaceholder.module.scss';

const WindowAnimationPlaceholderComponent: FC<{
  placeholderDirection: MaximizePlaceholderDirection,
  top: number,
  left: number,
  width: number,
  height: number
}> = memo(({ placeholderDirection: showMaximizePlacehodler, top, left, width, height }) => {

  const getClass = () => {
    switch (showMaximizePlacehodler) {
      case MaximizePlaceholderDirection.Full: return styles.maximizePlaceholderModal;
      case MaximizePlaceholderDirection.Left: return styles.leftSideMaximizePlaceholderModal;
      case MaximizePlaceholderDirection.Right: return styles.rightSideMaximizePlaceholderModal;
      default: return styles.hideModal;
    };
  }

  const getAnimation = () => {
    switch (showMaximizePlacehodler) {
      case MaximizePlaceholderDirection.Full: return maximizeAnimation;
      case MaximizePlaceholderDirection.Left: return leftMaximizeAnimation;
      case MaximizePlaceholderDirection.Right: return rightMaximizeAnimation;
    }
  }

  return (
    <Fragment>
      <style children={`
        ${maximizeAnimation.animation(left, width, height)} 
        ${leftMaximizeAnimation.animation(top, height)} 
        ${rightMaximizeAnimation.animation(top, height)} 
        ${heightMaximizeAnimation.animation(left, width, height)}
      `}/>

      {
        <div
          style={{ animationName: getAnimation()?.name }}
          className={getClass()}
        ></div>
      }
      { 
        showMaximizePlacehodler === MaximizePlaceholderDirection.Height &&
        <div 
          style={{ 
            animationName: heightMaximizeAnimation.name,
            width,
            left
          }}
          className={styles.heightMaximizePlaceholderModal}
        >
        </div>
      }
    </Fragment>
  );
}, (oldProps, newProps) => {
  return (
    oldProps.placeholderDirection === newProps.placeholderDirection
  )
});

export default WindowAnimationPlaceholderComponent;