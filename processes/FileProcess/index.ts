import { ExplorerFile } from '../../types/ExplorerElement';
import { v4 } from 'uuid';

export class FileProcess {
  private static root: ExplorerFile; 

  static getRoot() {
    if (!this.root)
      this.setRoot();
    return this.root;
  }

  private constructor() { }

  private static setRoot() {
    this.root = {
      name: 'root',
      id: 'root',
      children: [],
      parent: null
    };

    this.root.children.push({
      name: 'Deskop',
      id: 'desktop',
      children: [],
      parent: this.root
    });

    this.root.children.push({
      name: 'Document',
      id: 'document',
      children: [],
      parent: this.root
    });

    this.setFakeDesktopFiles(this.root.children[0]);
  }

  static addFile(name: string, iconPath: string, parent: ExplorerFile | null) {
    const file = {
      name,
      iconPath,
      parent,
      children: [],
      id: v4()
    };

    if (parent)
      parent.children.push(file);
  }

  private static setFakeDesktopFiles(desktop: ExplorerFile) {
    const elements: ExplorerFile[] = [
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #1',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #2',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #3',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #4',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #5',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #6',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #7',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #8',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #9',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #10',
        parent: desktop
      },
      {
        children: [],
        iconPath: '/icons/folder-icon.png',
        name: 'num #11',
        parent: desktop
      }
    ];

    desktop.children = elements;
  }
}