import { ShortcutCommand } from './ShortcutCommand';

export enum ShortcutCommandNames {
	DELETE,
	RENAME
}

export enum IconPaths {
	SHORTCUT_DELETE = '/icons/win11_shortcut_bin.png',
	SHORTCUT_RENAME = '/icons/win11_shortcut_rename.png'
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
