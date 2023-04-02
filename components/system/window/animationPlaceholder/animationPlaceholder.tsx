import { FC, memo } from "react";
import { heightMaximizeAnimation, leftMaximizeAnimation, maximizeAnimation, rightMaximizeAnimation } from "../../../../animations/windowMaximizeAnimations";
import { MaximizePlaceholderDirection } from "../../../../constants/system/window/MaximizePlaceholderDirectionEnum";
import { WINDOW_COMPONENT_ANIMATION_PLACEHOLDER_ZINDEX_OFFSET } from "../../../../constants/Zindex";
import styles from './animationPlaceholder.module.scss';
import { WindowMaximizePlaceholderProps } from "../../../../types/system/window/WindowAnimationPlaceholder";

const WindowAnimationPlaceholderComponent: FC<WindowMaximizePlaceholderProps> =
memo(({ placeholderDirection, top, left, width, height, zIndex }) => {

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
    <>
      <style
        children={`
          ${maximizeAnimation.animation(left, width, height)}
          ${leftMaximizeAnimation.animation(top, height)}
          ${rightMaximizeAnimation.animation(top, height)}
          ${heightMaximizeAnimation.animation(left, width, height)}
        `}
      />

      <div
        style={{ 
          animationName: getAnimation()?.name,
          zIndex: zIndex - WINDOW_COMPONENT_ANIMATION_PLACEHOLDER_ZINDEX_OFFSET
        }}
        className={getClass()}
      ></div>

      {/* TODO: once styled components are used, try moving it with the code above. Right now the css needs to know width and left for the final placeholder position. */}
      { 
        placeholderDirection === MaximizePlaceholderDirection.Height &&
        <div 
          style={{ 
            animationName: heightMaximizeAnimation.name,
            zIndex: zIndex - WINDOW_COMPONENT_ANIMATION_PLACEHOLDER_ZINDEX_OFFSET,
            width,
            left
          }}
          className={styles.heightMaximizePlaceholderModal}
        >
        </div>
      }
    </>
  );
}, (oldProps, newProps) => {
  return (
    oldProps.placeholderDirection === newProps.placeholderDirection
  );
});

export default WindowAnimationPlaceholderComponent;