import { DEFAULT_WIDTH_SUB_MENU } from "../components/system/contextMenu/contextMenuComponent";
import { ContextMenuParams } from "../types/system/contextMenu/contextMenuParams";

/**
* Avoid root context menu to go out of screen.
* @param params 
*/
export const correctRootContextMenuPosition = (params: ContextMenuParams): ContextMenuParams => {
 // top and left are the mouse position.
 const width = params.width || DEFAULT_WIDTH_SUB_MENU;
 const left = params.left + width > window.innerWidth ?
   params.left - width :
   params.left;

 return {
   ...params,
   left
 };
}

export const correctSubMenuPosition = (subMenuLeft: number, subMenuWidth: number, parentLeft: number) => {
  const subMenuFutureRight = subMenuLeft + subMenuWidth + parentLeft;
  return  subMenuFutureRight > window.innerWidth ?
    subMenuLeft - subMenuWidth :
    subMenuLeft;
}
