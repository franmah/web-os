import { useState } from "react";
import { v4 } from "uuid";
import { getExampleDesktopChildren } from "../services/FileSystemService";
import { ExplorerFile } from "../types/ExplorerElement";

export const useFileSystemContextState = () => {
  const rootFile: ExplorerFile = {
    name: 'root',
    id: 'root',
    children: [],
    parent: null
  };

  rootFile.children.push({
    name: 'Deskop',
    id: 'desktop',
    children: [],
    parent: rootFile
  });

  rootFile.children.push({
    name: 'Document',
    id: 'document',
    children: [],
    parent: rootFile
  });

  rootFile.children[0].children = getExampleDesktopChildren(rootFile.children[0]);

  const [root, setRoot] = useState<ExplorerFile>(rootFile);

  const addFile = (name: string, iconPath: string, parent: ExplorerFile | null) => {
    setRoot(root => {

      const file = {
        name,
        iconPath,
        parent,
        children: [],
        id: v4()
      };
  
      if (parent)
        parent.children.push(file);
      
      return root;
    });
  };

  const getDesktop = (): ExplorerFile => {
    return root.children[0];
  };

  return { root, addFile, getDesktop };
}
