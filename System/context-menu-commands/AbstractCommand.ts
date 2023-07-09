import { ComponentType } from 'react';

export abstract class ContextMenuCommand {
	text: string;
	IconComponent?: ComponentType;

	abstract execute(): boolean;

	constructor(text: string, icon?: ComponentType) {
		this.text = text;
		this.IconComponent = icon;
	}
}
