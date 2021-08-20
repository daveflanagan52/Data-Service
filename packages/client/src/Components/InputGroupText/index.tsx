import React from 'react';

type InputGroupTextProps = {
  text: string,
}

const InputGroup: React.FC<InputGroupTextProps> = (props: InputGroupTextProps) => (
  <span className="input-group-text">{props.text}</span>
);

export default InputGroup;
