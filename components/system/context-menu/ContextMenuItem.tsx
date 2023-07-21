import { FC, useContext } from 'react';
import { ProcessContext } from '../../../contexts/ProcessContext';
import { ContextMenuCommand } from '../../../System/context-menu-commands/AbstractCommand';
import styles from './context-menu.module.scss';
import { CONTEXT_MENU_ITEM_HEIGHT } from './ContextMenu';
import Image from 'next/image';

const ContextMenuItemComponent: FC<{
	command: ContextMenuCommand;
	handleMouseEnter: () => void;
}> = ({ command, handleMouseEnter }) => {
	const process = useContext(ProcessContext);

	const onClickEvent = (execute: Function) => {
		const close = execute();

		if (close) {
			process.closeProcess('contextMenu');
		}
	};

	return (
		<div
			className={styles.contextMenuItem}
			onMouseOver={handleMouseEnter}
			onClick={() => onClickEvent(command.execute)}
			style={{ height: `${CONTEXT_MENU_ITEM_HEIGHT}px` }}
		>
			{/* Show either iconComponent or Icon path */}
			{
				command.IconComponent && (
					<div className={styles.commandIcon}>
						<command.IconComponent />
					</div>
				)
			}
			{
				command.iconPath && (
					<Image className={styles.commandIcon} src={command.iconPath} width={16} height={16} alt='icon'/>
				)
			}

			<div>{command.text}</div>
		</div>
	);
};

export default ContextMenuItemComponent;
