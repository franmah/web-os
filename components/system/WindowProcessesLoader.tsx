import { FC, useContext } from 'react';
import WindowComponent from './window/Window';
import { WindowContext } from '../../contexts/WindowContext';

export const WindowProcessesLoader: FC<{}> = () => {
	const windowContext = useContext(WindowContext);

	return (
		<>
			{Object.entries(windowContext.windows).map(([windowId, { process, state }]) => {
				return (
					<WindowComponent
						key={windowId}
						windowParams={process.windowParams}
						state={state}
						closeWindow={windowContext.closeWindow}
						handleWindowMouseDown={windowContext.focusWindow}
						hanldeMouseMove={windowContext.moveWindow}
						handleStartMoving={windowContext.startMovingWindow}
						handleStartResizing={windowContext.startResizingWindow}
						handleMouseUp={windowContext.handleMouseUp}
						handleMaximize={windowContext.maximizeWindow}
						handleMoveToCustomMaximizeOptionClick={windowContext.moveWindowToCustomMaimizeOption}
						handleHeightMaximize={windowContext.heightMaximizeWindow}
						onMinimize={windowContext.minimizeWindow}
					>
						<process.Component updateWarnUserBeforeClose={windowContext.updateWarnBeforeProcessCloses} params={process.params} />
					</WindowComponent>
				);
			})}
		</>
	);
};
