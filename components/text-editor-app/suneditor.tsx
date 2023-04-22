import dynamic from "next/dynamic";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import SunEditorCore from "suneditor/src/lib/core";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export const StyledSunEditorContainer = styled.div`

  width: 100%;
  height: 100%;
  background-color: white;
  overflow: scroll;

  // Make suneditor toolbar buttons smaller 
  .se-toolbar li button {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
`;

/**
 * Note about error TypeError: this._resourcesStateChange is not a function,
 * fixed by using reactStrictMode = false in next.config.js
 * @returns 
 */
const SunTextEditorComponent: FC<{
  params: { processId: string, originalContent: string},
  updateWarnUserBeforeClose: (processId: string, canClose: boolean) => void
}> = ({
  params: { processId, originalContent },
  updateWarnUserBeforeClose
}) => {

  const [savedContent, saveContent] = useState<String>(originalContent || '');

  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  }

  const handleSave = (content: string) => {
    updateWarnUserBeforeClose(processId, false);
    saveContent(content);
  }

  const handleChange = (content: string) => {
    updateWarnUserBeforeClose(processId, true);
  }

  return (
    <StyledSunEditorContainer
      id={processId}
    >
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        lang='en'
        setContents={originalContent || ''}
        width="100%"
        height={`${window.innerHeight}px`}
        autoFocus={true}
        onSave={handleSave}
        onChange={handleChange}
        setDefaultStyle="cursor: text"
        setOptions={{
          buttonList: [
            ['undo', 'redo',
            'print',
            'font', 'fontSize', 'formatBlock',
            'bold', 'underline', 'italic', 'strike',
            'align', 'horizontalRule', 'list', 'lineHeight',
            'outdent', 'indent',
            'save',]
          ],
          resizingBar: false,
          resizingBarContainer: document.getElementById(processId) as HTMLElement
        }}
       />
    </StyledSunEditorContainer>
  )
};

export default SunTextEditorComponent;