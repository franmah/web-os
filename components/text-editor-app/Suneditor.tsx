import dynamic from 'next/dynamic';
import { FC, useContext, useRef } from 'react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import SunEditorCore from 'suneditor/src/lib/core';
import { ExplorerItem } from '../../types/system/file/ExplorerItem';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { StyledSunEditorContainer } from '../../styled-components/StyledSuneditorContainer';

const SunEditor = dynamic(() => import('suneditor-react'), {
	ssr: false
});

/**
 * Note about error TypeError: this._resourcesStateChange is not a function,
 * fixed by using reactStrictMode = false in next.config.js
 * @returns
 */
const SunTextEditor: FC<{
	params: { processId: string; file: ExplorerItem };
	updateWarnUserBeforeClose: (processId: string, canClose: boolean) => void;
}> = ({ params: { processId, file }, updateWarnUserBeforeClose }) => {
	const editor = useRef<SunEditorCore>();
	const { updateFile } = useContext(FileSystemContext);

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleSave = (content: string) => {
		updateWarnUserBeforeClose(processId, false);
		updateFile(file, content);
	};

	const handleChange = (content: string) => {
		updateWarnUserBeforeClose(processId, true);
	};

	return (
		<StyledSunEditorContainer id={processId}>
			<SunEditor
				getSunEditorInstance={getSunEditorInstance}
				lang='en'
				setContents={file?.content || ''}
				width='100%'
				height={`${window.innerHeight}px`}
				autoFocus={true}
				onSave={handleSave}
				onChange={handleChange}
				setDefaultStyle='cursor: text'
				setOptions={{
					buttonList: [
						[
							'undo',
							'redo',
							'print',
							'font',
							'fontSize',
							'formatBlock',
							'bold',
							'underline',
							'italic',
							'strike',
							'align',
							'horizontalRule',
							'list',
							'lineHeight',
							'outdent',
							'indent',
							'save'
						]
					],
					resizingBar: false,
					resizingBarContainer: document.getElementById(processId) as HTMLElement
				}}
			/>
		</StyledSunEditorContainer>
	);
};

export default SunTextEditor;
