import dynamic from "next/dynamic";
import { FC, useRef } from "react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import SunEditorCore from "suneditor/src/lib/core";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

// TODO: rename to SunEditor component. Change the name in Process Directory (There can be multiple text editor)
const TextEditorComponent: FC<{ params: any }> = () => {
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
      <p> My Other Contents </p>
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
       />
    </div>
  )
};

export default TextEditorComponent;