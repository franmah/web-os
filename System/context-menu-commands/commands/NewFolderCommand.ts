import { ContextMenuCommand } from '../AbstractCommand';

export class NewFolderCommand extends ContextMenuCommand {
	private callback: () => any;

	constructor(callback: () => any) {
		super('Folder', require('react-icons/fc').FcFolder);
		this.callback = callback;
	}

	execute = (): boolean => {
		this.callback();
		return true;
	};
}
