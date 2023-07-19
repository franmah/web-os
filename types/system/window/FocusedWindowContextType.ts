export type FocusedWindowContextType = {
  focusedWindowId: string;
  focusWindow: (windowId: string) => void;
  unFocusCurrentWindow: () => void;
}
