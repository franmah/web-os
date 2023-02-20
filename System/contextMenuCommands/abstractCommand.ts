export abstract class ContextMenuCommand {
  text: string;
  callback: () => any;

  abstract execute(): void;

  constructor(text: string, callback: () => any) {
    this.text = text;
    this.callback = callback;
  }
};
