import { FC } from 'react';
import { StyledCheckbox } from '../../styled-components/system/StyledCustomCheckbox';

const CustomCheckbox: FC<{
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
  };

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

export default CustomCheckbox;