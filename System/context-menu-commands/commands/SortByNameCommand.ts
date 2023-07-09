import { ContextMenuCommand } from '../AbstractCommand';

export class SortByNameCommand extends ContextMenuCommand {
	private callback: () => any;

	constructor(callback: () => void) {
		super('Name');
		this.callback = callback;
	}

	execute = (): boolean => {
		this.callback();
		return true;
	};
}
