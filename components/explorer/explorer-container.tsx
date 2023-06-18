import { FC, useState } from "react";
import styled from "styled-components";
import ExplorerAccessBar from "./access-bar";

export const StyledExplorerContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
`;

const ExplorerContainer: FC<{ params: { startPath: string }}> = ({
  params: { startPath }
}) => {

  const [path, setPath] = useState<string>(startPath);

  return (
    <StyledExplorerContainer>
      <ExplorerAccessBar path={path} />
    </StyledExplorerContainer>
  );
};

export default ExplorerContainer;