import { FC } from 'react';
import Image from 'next/image';
import { WindowHeaderOptions } from '../../../../types/system/window/WindowHeaderOptions';
import { StyledHeaderInformationH1 } from '../../../../styled-components/system/window/StyledHeaderInformationH1';

export const WindowHeaderInformation: FC<{
	options: WindowHeaderOptions;
	focused: boolean;
	startMovingWindow: (event: any) => void;
	maximizeWindow: (event: any) => void;
}> = ({ options, focused, startMovingWindow, maximizeWindow }) => {
	return (
		<>
			{options?.icon && (
				<Image
					style={{ marginLeft: '8px', marginRight: '4px' }}
					src={options?.icon}
					alt={'window name'}
					width={18}
					height={18}
				/>
			)}

			<StyledHeaderInformationH1 focused={focused} onMouseDown={startMovingWindow} onDoubleClick={maximizeWindow}>
				{options?.text}
			</StyledHeaderInformationH1>
		</>
	);
};
