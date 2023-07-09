import { ContextMenuCommand } from '../AbstractCommand';
export class PinToQuickAccessCommand extends ContextMenuCommand {
	private callback: () => any;

	constructor(callback: () => any) {
		super('Pin to Quick Access', require('react-icons/tb').TbPin);
		this.callback = callback;
	}

	execute = (): boolean => {
		this.callback();
		return true;
	};
}
