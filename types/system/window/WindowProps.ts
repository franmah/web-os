import { WindowHeaderOptions } from "../../../components/system/window/header/header";

export type WindowProps = {
  processId: string,
  windowId: string,
  headerOptions?: WindowHeaderOptions,
};