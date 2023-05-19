import { useState } from "react";
import { v4 } from "uuid";
import { getRootAtSystemStart } from "../services/FileSystemService";
import { ExplorerFile } from "../types/system/file/ExplorerElement";

export const useFileSystemContextState = () => {

  const rootFile: ExplorerFile = getRootAtSystemStart();

  const [getRoot, setRoot] = useState<() => ExplorerFile>(() => () => rootFile);

  let getDesktop = (): ExplorerFile => getRoot()?.children?.[0];

  const addFile = (name: string, iconPath: string, parent: ExplorerFile | null, id?: string) => {
    setRoot(getRoot => {

      const root = getRoot();

      const file = {
        name,
        iconPath,
        parent,
        children: [],
        id: id || v4()
      };
  
      if (parent)
        parent.children.push(file);
      
      getDesktop = () => root?.children?.[0];

      return () => root;
    });
  };


  return { getRoot, addFile, getDesktop };
}