import { FC,} from "react";
import { Process } from "../../types/system/processes/processes";

const ProcessRenderer: FC<{ id: string, process: Process }> = ({ id, process: { params, Component } }) => {
    return <Component key={id} params={params}></Component>
};

export default ProcessRenderer;