import dynamic from "next/dynamic";
import { FC, useRef } from "react";
import styled from "styled-components";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import SunEditorCore from "suneditor/src/lib/core";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export const StyledSunEditorContainer = styled.div`

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
// TODO: rename to SunEditor component. Change the name in Process Directory (There can be multiple text editor)
const TextEditorComponent: FC<{ params: any, updateWarnUserBeforeClose: (processId: string, canClose: boolean) => void }> = ({
  params,
  updateWarnUserBeforeClose
}) => {
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  }

  const handleEditorChange = (content: string) => {
    console.log(content) // TODO: save in useRef?
  }

  return (
    <StyledSunEditorContainer id='test-text-editor-container'  // Should be the process id.
      style={{ width: '100%', height: '100%', backgroundColor: 'white', overflow: 'scroll' }}
    >

      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        lang='en'
        setContents={'default value'}
        width="100%"
        height={`${window.innerHeight}px`}
        autoFocus={true}
        setDefaultStyle="cursor: text"
        onChange={handleEditorChange}
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
          resizingBarContainer: document.getElementById('test-text-editor-container') as HTMLElement
        }}
        
       />
    </StyledSunEditorContainer>
  )
};

export default TextEditorComponent;