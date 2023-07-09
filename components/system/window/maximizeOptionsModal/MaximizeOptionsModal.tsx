import { FC, memo } from 'react';
import { CustomMaximizeDirection } from '../../../../constants/system/window/CustomMaximizeDirectionEnum';
import { StyledMaximizeOptionsModalMain } from '../../../../styled-components/system/window/StyledMaximizeOptionsModalMain';

const MaximizeOptionsModal: FC<{
	onCustomMaximizeClick: (direction: CustomMaximizeDirection) => void;
}> = memo(
	({ onCustomMaximizeClick }) => {
		return (
			<StyledMaximizeOptionsModalMain>
				<div className='topLeft'>
					<div className='left item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Left)}></div>
					<div className='right item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Right)}></div>
				</div>

				<div className='topRight'>
					<div className='left item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.LargerLeft)}></div>
					<div className='right item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.SmallerRight)}></div>
				</div>

				<div className='bottomLeft'>
					<div className='left item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Left)}></div>
					<div className='top item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopRight)}></div>
					<div className='bottom item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomRight)}></div>
				</div>

				<div className='bottomRight'>
					<div className='topLeft item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopLeft)}></div>
					<div className='topRight item' onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopRight)}></div>
					<div
						className='bottomLeft item'
						onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomLeft)}
					></div>
					<div
						className='bottomRight item'
						onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomRight)}
					></div>
				</div>
			</StyledMaximizeOptionsModalMain>
		);
	},
	() => true
);

MaximizeOptionsModal.displayName = 'MaximizeOptionsModal';
export default MaximizeOptionsModal;
