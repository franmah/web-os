import { IconPaths } from '../../constants/IconPaths';
import { ShortcutCommand } from './ShortcutCommand';

export enum ShortcutCommandNames {
	DELETE,
	RENAME
}

export const getShorcutCommand = (command: ShortcutCommandNames, callback: () => any, name: string) => {
	switch (command) {
		case ShortcutCommandNames.DELETE:
			return new ShortcutCommand(callback, IconPaths.SHORTCUT_DELETE, name);
		case ShortcutCommandNames.RENAME:
			return new ShortcutCommand(callback, IconPaths.SHORTCUT_RENAME, name);
		default:
			throw new Error('Unknown shortcut command name');
	}
};
