import { DEFAULT_WIDTH_SUB_MENU } from '../../../components/system/context-menu/ContextMenu';
import { ContextMenuCommand } from '../AbstractCommand';
import ContextMenuCommandContainer from '../AbstractCommandContainer';

export class NewItemCommandContainer extends ContextMenuCommandContainer {
	constructor(commands: (ContextMenuCommand | ContextMenuCommandContainer)[]) {
		super('New', commands, DEFAULT_WIDTH_SUB_MENU, require('react-icons/ai').AiOutlinePlusCircle);
	}
}
