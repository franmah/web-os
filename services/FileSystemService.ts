import { FOLDER_ICON_PATH } from "../constants/FileSystemConsts";
import { ExplorerFile } from "../types/system/file/ExplorerElement";

export const getRootAtSystemStart = (): ExplorerFile => {
  const root: ExplorerFile = {
    name: 'root',
    id: 'root',
    children: [],
    parent: null
  };

  root.children.push({
    name: 'Deskop',
    id: 'desktop',
    children: [],
    parent: root
  });

  root.children.push({
    name: 'Document',
    id: 'document',
    children: [],
    parent: root
  });

  root.children[0].children = getExampleDesktopChildren(root.children[0]);

  return root;
}

const getExampleDesktopChildren = (desktop: ExplorerFile): ExplorerFile[] => [
  {
    children: [],
    iconPath: FOLDER_ICON_PATH,
    name: 'New folder (2)',
    id: 'num #2',
    parent: desktop
  },
  {
    children: [],
    iconPath: FOLDER_ICON_PATH,
    name: 'New folder (3)',
    id: 'num #3',
    parent: desktop
  },
  {
    children: [],
    iconPath: FOLDER_ICON_PATH,
    name: 'New folder',
    id: 'num #1',
    parent: desktop
  },
  {
    children: [],
    iconPath: FOLDER_ICON_PATH,
    name: 'num #6',
    id: 'num #6',
    parent: desktop
  },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #7',
  //   id: 'num #7',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #4',
  //   id: 'num #4',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #5',
  //   id: 'num #5',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #10',
  //   id: 'num #10',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #11',
  //   id: 'num #11',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #8',
  //   id: 'num #8',
  //   parent: desktop
  // },
  // {
  //   children: [],
  //   iconPath: FOLDER_ICON_PATH,
  //   name: 'num #9',
  //   id: 'num #9',
  //   parent: desktop
  // },
];