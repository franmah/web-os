import { ComponentType } from "react";

export abstract class ContextMenuCommand {
  text: string;
  IconComponent?: ComponentType;
   
  callback: () => any;

  abstract execute(): void;

  constructor(text: string, callback: () => any, icon?: ComponentType) {
    this.text = text;
    this.callback = callback;
    this.IconComponent = icon
  }
};
