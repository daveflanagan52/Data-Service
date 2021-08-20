import React, { ReactNode } from 'react';

interface RowProps {
  children: ReactNode | ReactNode[],
}

const Row: React.FC<RowProps> = (props: RowProps) => (
  <div className="row">
    {props.children}
  </div>
);

export default Row;
