import { FC, Fragment, memo } from "react";
import { heightMaximizeAnimation, leftMaximizeAnimation, maximizeAnimation, rightMaximizeAnimation } from "../../../../animations/windowMaximizeAnimations";
import { MaximizePlaceholderDirection } from "../../../../constants/system/window/MaximizePlaceholderDirectionEnum";
import { WINDOW_ANIMATION_PLACEHOLDER_ZINDEX } from "../../../../constants/Zindex";
import styles from './animationPlaceholder.module.scss';

const WindowAnimationPlaceholderComponent: FC<{
  placeholderDirection: MaximizePlaceholderDirection,
  top: number,
  left: number,
  width: number,
  height: number
}> = memo(({ placeholderDirection, top, left, width, height }) => {

  const getClass = () => {
    switch (placeholderDirection) {
      case MaximizePlaceholderDirection.Full: return styles.maximizePlaceholderModal;
      case MaximizePlaceholderDirection.Left: return styles.leftSideMaximizePlaceholderModal;
      case MaximizePlaceholderDirection.Right: return styles.rightSideMaximizePlaceholderModal;
      default: return styles.hideModal;
    };
  };

  const getAnimation = () => {
    switch (placeholderDirection) {
      case MaximizePlaceholderDirection.Full: return maximizeAnimation;
      case MaximizePlaceholderDirection.Left: return leftMaximizeAnimation;
      case MaximizePlaceholderDirection.Right: return rightMaximizeAnimation;
    }
  };

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
          style={{ 
            animationName: getAnimation()?.name,
            zIndex: WINDOW_ANIMATION_PLACEHOLDER_ZINDEX
          }}
          className={getClass()}
        ></div>
      }
      { 
        placeholderDirection === MaximizePlaceholderDirection.Height &&
        <div 
          style={{ 
            animationName: heightMaximizeAnimation.name,
            zIndex: WINDOW_ANIMATION_PLACEHOLDER_ZINDEX,
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
  );
});

export default WindowAnimationPlaceholderComponent;