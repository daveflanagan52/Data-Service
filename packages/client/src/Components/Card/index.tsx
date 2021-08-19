import React, { ReactNode } from 'react';

interface CardProps {
  headerItems?: ReactNode[],
  footerItems?: ReactNode[],
  children: ReactNode | ReactNode[],
  bodyClassName?: string,
}

const Card: React.FC<CardProps> = (props: CardProps) => {

  return (
    <div className='card mb-4'>
      {props.headerItems && (
        <div className='card-header bg-dark text-white d-flex'>
          {props.headerItems}
        </div>
      )}
      <div className={props.bodyClassName || 'card-body'}>
        {props.children}
      </div>
      {props.footerItems && (
        <div className='card-footer d-flex'>
          {props.footerItems}
        </div>
      )}
    </div>
  );
}

export default Card;