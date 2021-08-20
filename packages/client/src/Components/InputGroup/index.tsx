import React, { ReactNode } from 'react';

type InputGroupProps = {
  children?: ReactNode | ReactNode[],
}

const InputGroup: React.FC<InputGroupProps> = (props: InputGroupProps) => (
  <div className="input-group">
    {props.children}
  </div>
);

export default InputGroup;
