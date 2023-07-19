import { useState } from 'react';

export const useFocusedWindowContextState = () => {
	const [focusedWindowId, setFocusedWindowId] = useState<string>('');

  /**
   * Automatically unfocus the previous window.
   * @param windowId
   */
	const focusWindow = (windowId: string) => {
		setFocusedWindowId(windowId);
	};

	const unFocusCurrentWindow = () => {
		setFocusedWindowId('');
	};

	return {
		focusWindow,
		focusedWindowId,
		unFocusCurrentWindow
	};
};
