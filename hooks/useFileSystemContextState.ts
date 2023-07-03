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

  const searchFolderV2 = (path: string, partialName: string): Promise<string[]> => {
    const fileNode = _getNodeFromPath(path);
    const filePaths: string[] = [];
    const MAX_SEARCH_DEPTH = 20; // How far down the file tree to search.
    partialName = partialName.toLowerCase();

    const searchNode = (node: ExplorerFile, level: number, currentPath: string) => {
      if (!node)
        return;

      if (level === MAX_SEARCH_DEPTH)
        return;

      if (node.name.toLowerCase().includes(partialName))
        filePaths.push(currentPath);

      for (let child of node.children) {
        const childPath = currentPath + '/' + child.name;
        searchNode(child, level + 1, childPath);
      }
    }

    searchNode(fileNode, 0, path);

    return Promise.resolve(filePaths);
  }

  const readdirV2 = (path: string): Promise<string[]> => {
    const fileNode = _getNodeFromPath(path);
    return Promise.resolve(fileNode.children?.map(file => file.name) || []);
  };

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
  };

  const updateFile = (file: ExplorerFile, content: any) => {
    file.content = content;
  };

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

  const _getNodeFromPath = (path: string): ExplorerFile => {
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

    return fileNode;
  }

  return {
    getRoot,
    appendFile,
    getDesktop,
    mkdir,
    updateFile,
    readdirV2,
    searchFolderV2
  };
}