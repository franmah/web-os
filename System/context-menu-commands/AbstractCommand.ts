import { ComponentType } from 'react';

export abstract class ContextMenuCommand {
	text: string;
	IconComponent?: ComponentType;
	iconPath?: string;

	abstract execute(): boolean;

	constructor(text: string, icon?: ComponentType, iconPath?: string) {
		this.text = text;
		this.IconComponent = icon;
		this.iconPath = iconPath;
	}
}
