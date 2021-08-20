import React from 'react';

type FormLabelProps = {
  text: string,
  htmlFor: string,
}

const FormLabel: React.FC<FormLabelProps> = (props: FormLabelProps) => {
  return (
    <label htmlFor={props.htmlFor} className='form-label'>{props.text}</label>
  );
}

export default FormLabel;