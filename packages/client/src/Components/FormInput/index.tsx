import React, { FocusEventHandler, ChangeEventHandler } from 'react';

enum FormInputType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
};

type FormInputProps = {
  id: string,
  name: string,
  type: FormInputType,
  value: any,
  readOnly?: boolean,
  isInvalid?: boolean,
  disabled?: boolean,
  placeholder?: string,
  onFocus?: FocusEventHandler<HTMLInputElement>,
  onChange?: ChangeEventHandler<HTMLInputElement>,
  onBlur?: FocusEventHandler<HTMLInputElement>,
}

const FormInput: React.FC<FormInputProps> = (props: FormInputProps) => {
  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type}
      className={[
        props.readOnly ? 'form-control' : 'form-control',
        props.isInvalid ? 'is-invalid' : '',
      ].join(' ')}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onFocus={props.onFocus}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  );
}

export default FormInput;
export { FormInputType };