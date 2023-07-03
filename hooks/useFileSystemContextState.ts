import { useState } from "react";
import { v4 } from "uuid";
import { getRootAtSystemStart } from "../services/FileSystemService";
import { ExplorerFile } from "../types/system/file/ExplorerElement";
import { FOLDER_ICON_PATH } from '../constants/FileSystemConsts';
import { convertPathToFragments } from "../services/file-system/FilePathService";

export const useFileSystemContextState = () => {

  const rootFile: ExplorerFile = getRootAtSystemStart();

  const [getRoot, setRoot] = useState<() => ExplorerFile>(() => () => rootFile);

  let getDesktop = (): ExplorerFile => getRoot()?.children?.[0];

  const readdirV2 = (path: string): Promise<string[]> => {
    if (path.at(-1) === '/')
      path = path.substring(0, path.length - 1);

    const fragments = convertPathToFragments(path);
    let fileNode = getRoot();

    for (let folder of fragments) {
      const childNode = fileNode.children?.find(file => file.name === folder);
      if (!childNode)
        throw Error(`Can't find directory ${folder} in path: ${path}`);
      fileNode = childNode;
    }

    return Promise.resolve(fileNode.children?.map(file => file.name) || []);
  }

  const mkdir = (name: string, parent: ExplorerFile, id?: string) => {
    setRoot(getRoot => {
      const root = getRoot();

      const file = {
        name,
        FOLDER_ICON_PATH,
        parent,
        children: [],
        id: id || v4(),
        isFolder: true
      };
  
      if (parent)
        parent.children.push(file);
      
      getDesktop = () => root?.children?.[0];

      return () => root;
    });
  }

  const updateFile = (file: ExplorerFile, content: any) => {
    file.content = content;
  }

  const appendFile = (name: string, iconPath: string, parent: ExplorerFile | null, id?: string, content?: any) => {
    setRoot(getRoot => {

      const root = getRoot();

      const extension = name.split(".").at(-1);

      const file: ExplorerFile = {
        name,
        iconPath,
        children: [],
        parent,
        id: id || v4(),
        isFolder: false,
        extension,
        content
      };
  
      if (parent) {
        parent.children.push(file);
      }

      getDesktop = () => root?.children?.[0];

      return () => root;
    });
  };

  return {
    getRoot,
    appendFile,
    getDesktop,
    mkdir,
    updateFile,
    readdirV2
  };
}