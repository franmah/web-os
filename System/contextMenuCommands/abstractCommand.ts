import { ComponentType } from "react";

export abstract class ContextMenuCommand {
  text: string;
  icon?: ComponentType;
   
  callback: () => any;

  abstract execute(): void;

  constructor(text: string, callback: () => any, icon?: ComponentType) {
    this.text = text;
    this.callback = callback;
    this.icon = icon
  }
};
