import dynamic from 'next/dynamic';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import SunEditorCore from 'suneditor/src/lib/core';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { StyledSunEditorContainer } from '../../styled-components/StyledSuneditorContainer';
import { CommonFolderPaths } from '../../constants/system/file-system/CommonFilePaths';

const SunEditor = dynamic(() => import('suneditor-react'), {
	ssr: false
});

/**
 * Note about error TypeError: this._resourcesStateChange is not a function,
 * fixed by using reactStrictMode = false in next.config.js
 * @returns
 */
const SunTextEditor: FC<{
	params: any,
	updateWarnUserBeforeClose: (processId: string, canClose: boolean) => void;
}> = ({ params, updateWarnUserBeforeClose }) => {

	let path = params?.path;
	const processId = params?.processId;

	const editor = useRef<SunEditorCore>();
	const { readFile, appendFile, exists } = useContext(FileSystemContext);

	const [fileLoaded, setFileLoaded] = useState<boolean>(false);

	const content = useRef<string>('');

	useEffect(() => {
		try {
			const file = readFile(path);
			content.current = file?.content || '';
			setFileLoaded(true);
		} catch (error) {
			console.error('Suneditor: error reading file.', error);
		}
	}, [path]);

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleSave = async () => {
		try {
			// TODO: instead of creating a new file show create file popup.
			if (!path) {
				for (let i = 1; i < 50; i++) {
					path = '/' + CommonFolderPaths.DESKTOP + '/new text file (' + i + ').txt';
					if (!(await exists(path))) {
						break;
					}
				}
			}

			updateWarnUserBeforeClose(processId, false);
			appendFile(path, content.current);
		} catch (error) {
			console.error('Error saving text to ' + path + '.', error);
		}
	};

	const handleChange = (newContent: string) => {
		try {
			content.current = newContent;
			updateWarnUserBeforeClose(processId, true);
		} catch (error) {
			console.error('Error catching suneditor text change.', error);
		}
	};

	return (
		<StyledSunEditorContainer id={processId}>
			{
				fileLoaded &&
				<SunEditor
					getSunEditorInstance={getSunEditorInstance}
					lang='en'
					defaultValue={content.current}
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
						callBackSave: handleSave,
						resizingBar: false,
						resizingBarContainer: document.getElementById(processId) as HTMLElement
					}}
				/>
			}

		</StyledSunEditorContainer>
	);
};

export default SunTextEditor;
