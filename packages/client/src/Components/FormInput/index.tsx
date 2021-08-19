import React from 'react';
import { MouseEventHandler } from 'react';

enum InputType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
};

type InputProps = {
  type: InputType,
  onClick?: MouseEventHandler<HTMLInputElement>,
}

const FormInput: React.FC<InputProps> = (props: InputProps) => {
  return <input type={props.type} className={'form-input'} />
}

export default FormInput;
export { InputType };