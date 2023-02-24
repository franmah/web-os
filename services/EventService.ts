export const isEventOriginatedFromWithinTargetSubtree = (event: MouseEvent, targetId: string) => {
  let element: any = event.target;

  while (element) {
    const id: string = element.id;
    if (id.includes(targetId)) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}