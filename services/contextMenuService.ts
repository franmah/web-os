import { CONTEXT_MENU_ITEM_HEIGHT, DEFAULT_WIDTH_SUB_MENU } from "../components/system/contextMenu/contextMenuComponent";
import { CONTEXT_MENU_ROOT_ID } from "../components/system/contextMenu/ContextMenuRootComponent";
import { ContextMenuParams } from "../types/system/contextMenu/contextMenu";

const CONTEXT_MENU_HEIGHT_OFFSET = 40;

/**
* Avoid root context menu to go out of screen.
* @param params 
*/
export const correctRootContextMenuPosition = (params: ContextMenuParams): ContextMenuParams => {
  const width = params.width || DEFAULT_WIDTH_SUB_MENU;
  const left = params.left + width > window.innerWidth ?
    params.left - width :
    params.left;
  const top = params.top + (params.commands?.length * CONTEXT_MENU_ITEM_HEIGHT) > window.innerHeight - CONTEXT_MENU_HEIGHT_OFFSET ?
    params.top - params.commands?.length * CONTEXT_MENU_ITEM_HEIGHT :
    params.top;

  return {
    ...params,
    left,
      top
  };
};

export const correctSubMenuLeftPosition = (subMenuLeft: number, subMenuWidth: number, absoluteLeft: number): number => {
  const futureSubMenuRight = subMenuLeft + subMenuWidth + absoluteLeft;
  return  futureSubMenuRight > window.innerWidth ?
    subMenuLeft - subMenuWidth :
    subMenuLeft;
};

export const correctSubMenuTopPosition = (top: number, numElements: number, absoluteTop: number): number => {
  const futureSubMenuBottom = top + numElements * CONTEXT_MENU_ITEM_HEIGHT + absoluteTop;
  return futureSubMenuBottom > window.innerHeight - CONTEXT_MENU_HEIGHT_OFFSET ?
    top - numElements * CONTEXT_MENU_ITEM_HEIGHT :
    top;
};