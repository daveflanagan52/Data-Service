import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MouseEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

enum ButtonType {
  Primary = 'btn-primary',
  Secondary = 'btn-secondary',
  Success = 'btn-success',
  Danger = 'btn-danger',
  Warning = 'btn-warning',
  Info = 'btn-info',
  Light = 'btn-light',
  Dark = 'btn-dark',
  Link = 'btn-link',
}

type ButtonProps = {
  type: ButtonType,
  text: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  link?: string,
  icon?: IconProp
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  if (props.link)
    return <Link to={props.link} className={'btn ' + props.type}>{props.icon && <FontAwesomeIcon icon={props.icon} />} {props.text}</Link>
  else
    return <button type={props.onClick ? 'button' : 'submit'} onClick={props.onClick} className={'btn ' + props.type}>{props.icon && <FontAwesomeIcon icon={props.icon} />} {props.text}</button>
}

export default Button;
export { ButtonType };