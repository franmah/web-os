export class ShortcutCommand {
	private callback: () => any;
	private iconPath: string;
	private name: string;

	constructor(callback: () => any, iconPath: string, name: string) {
		this.callback = callback;
		this.iconPath = iconPath;
		this.name = name;
	}

	public getIconPath = () => this.iconPath;

	public getName = () => this.name;

	public execute = (): any => this.callback();
}
