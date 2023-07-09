import { ContextMenuCommand } from './AbstractCommand';
import { v4 as uuidv4 } from 'uuid';
import { ComponentType } from 'react';

/**
 * For context menu items that have a list of commands.
 */
abstract class ContextMenuCommandContainer {
	text: string;
	commands: (ContextMenuCommand | ContextMenuCommandContainer)[];
	id: string;
	subMenuWidth: number;
	IconComponent: ComponentType;

	constructor(
		text: string,
		commands: (ContextMenuCommand | ContextMenuCommandContainer)[],
		subMenuWidth: number,
		icon: ComponentType
	) {
		this.text = text;
		this.commands = commands || [];
		this.id = uuidv4();
		this.IconComponent = icon;
		this.subMenuWidth = subMenuWidth;
	}
}

export default ContextMenuCommandContainer;
