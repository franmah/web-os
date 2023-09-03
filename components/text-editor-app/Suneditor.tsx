import dynamic from 'next/dynamic';
import { FC, useContext, useEffect, useRef, useState } from 'react';
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
	params: { processId: string; path: string };
	updateWarnUserBeforeClose: (processId: string, canClose: boolean) => void;
}> = ({ params: { processId, path }, updateWarnUserBeforeClose }) => {
	const editor = useRef<SunEditorCore>();
	const { appendFile, readFile } = useContext(FileSystemContext);

	const [startContent, setStartContent] = useState({ loaded: false, content: '' });

	useEffect(() => {
		const file = readFile(path);
		setStartContent({ loaded: true, content: file?.content || ''});
	}, [path]);

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleSave = (content: string) => {
		updateWarnUserBeforeClose(processId, false);
		if (path)
			appendFile(path, content);
	};

	const handleChange = (content: string) => {
		updateWarnUserBeforeClose(processId, true);
	};

	return (
		<StyledSunEditorContainer id={processId}>
			{
				startContent.loaded &&
				<SunEditor
					getSunEditorInstance={getSunEditorInstance}
					lang='en'
					setContents={startContent.content}
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
			}

		</StyledSunEditorContainer>
	);
};

export default SunTextEditor;
