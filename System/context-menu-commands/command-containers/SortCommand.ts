import { SMALL_WIDTH_SUB_MENU } from '../../../components/system/context-menu/ContextMenu';
import { ContextMenuCommand } from '../AbstractCommand';
import ContextMenuCommandContainer from '../AbstractCommandContainer';

export class SortCommandContainer extends ContextMenuCommandContainer {
	constructor(commands: (ContextMenuCommand | ContextMenuCommandContainer)[]) {
		super('Sort by', commands, SMALL_WIDTH_SUB_MENU, require('react-icons/fc').FcAlphabeticalSortingAz);
	}
}
