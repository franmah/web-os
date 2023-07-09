import { FC, memo } from 'react';
import {
	heightMaximizeAnimation,
	leftMaximizeAnimation,
	maximizeAnimation,
	rightMaximizeAnimation
} from '../../../../animations/windowMaximizeAnimations';
import { MaximizePlaceholderDirection } from '../../../../constants/system/window/MaximizePlaceholderDirectionEnum';
import { WindowMaximizePlaceholderProps } from '../../../../types/system/window/WindowAnimationPlaceholder';
import { StyledAnimationMaximizePlaceholder } from '../../../../styled-components/system/window/StyledAnimationMaximizePlaceholder';

const WindowAnimationMaximizePlaceholder: FC<WindowMaximizePlaceholderProps> = memo(
	({ placeholderDirection, top, left, width, height, zIndex }) => {
		const getAnimation = () => {
			switch (placeholderDirection) {
				case MaximizePlaceholderDirection.Full:
					return maximizeAnimation;
				case MaximizePlaceholderDirection.Left:
					return leftMaximizeAnimation;
				case MaximizePlaceholderDirection.Right:
					return rightMaximizeAnimation;
				case MaximizePlaceholderDirection.Height:
					return heightMaximizeAnimation;
				default:
					return { name: '' };
			}
		};

		return (
			<>
				<style
					// eslint-disable-next-line react/no-children-prop
					children={`
          ${maximizeAnimation.animation(left, width, height)}
          ${leftMaximizeAnimation.animation(top, height)}
          ${rightMaximizeAnimation.animation(top, height)}
          ${heightMaximizeAnimation.animation(left, width, height)}
        `}
				/>

				<StyledAnimationMaximizePlaceholder
					direction={placeholderDirection}
					zIndex={zIndex}
					animationName={getAnimation().name}
					left={`${left}px`}
					width={`${width}px`}
				/>
			</>
		);
	},
	(oldProps, newProps) => {
		return oldProps.placeholderDirection === newProps.placeholderDirection;
	}
);

WindowAnimationMaximizePlaceholder.displayName = 'WindowAnimationMaximizePlaceholder';
export default WindowAnimationMaximizePlaceholder;
