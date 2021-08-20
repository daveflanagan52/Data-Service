import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type InputGroupIconProps = {
  icon: IconProp,
}

const InputGroup: React.FC<InputGroupIconProps> = (props: InputGroupIconProps) => {
  return (
    <span className='input-group-text'>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  );
}

export default InputGroup;