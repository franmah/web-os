
/**
 * @param event 
 * @param targetPrefixId usually the prefix of the module the target is in. Not the exact id.
 */
export const isEventOriginatedFromTarget = (event: MouseEvent, targetPrefixId: string) => {
  let element: any = event.target;

  while (element) {
    const id: string = element.id;
    if (id.includes(targetPrefixId)) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}