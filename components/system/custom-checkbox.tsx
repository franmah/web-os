import { FC } from "react";
import styled from "styled-components";

export const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 14px;
  height: 14px;

  border-radius: 0.20em;
  border: 0.1em solid #626262;
  background-color: ${({ checked }) => checked ? '#196EBF' : '#F3F3F3'};

  &:hover {
    background-color: ${({ checked }) => checked ? '#196EBF' : '#EAEAEA'};
  }

  .clip-path-container {
    width: 100%;
    height: 100%;
    background-color: #E2EDF7;
    clip-path: polygon(75% 24%, 81% 29%, 43% 77%, 15% 63%, 20% 57%, 40% 67%);
  }
`;


const Checkbox: FC<{
  className?: string,
  checked?: boolean,
  onClick?: (event: any) => void,
  onChange?: (event: any) => void
}> = ({ className = '', checked = false, onChange, onClick }) => {

  const handleClick = (e: any) => {
    if (onClick)
      onClick(e);
    
    if (onChange)
      onChange(!checked);
  }

  return (
    <StyledCheckbox
      className={className}
      checked={checked}
      onClick={handleClick}
    >
      <div className="clip-path-container"></div>
    </StyledCheckbox>
  );
};

export default Checkbox;