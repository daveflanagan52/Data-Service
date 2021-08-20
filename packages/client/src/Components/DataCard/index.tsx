import React, { ReactNode } from 'react';

import Card from '../Card';

interface DataCardProps {
  title: string,
  headerItems?: ReactNode[],
  footerItems?: ReactNode[],
  data: { [key: string]: number | string },
}

const DataCard: React.FC<DataCardProps> = (props: DataCardProps) => {
  if (!props.data || Object.keys(props.data).length === 0) {
    return null;
  }
  return (
    <>
      <Card
        footerItems={props.footerItems}
        headerItems={[
          <h1 key="title" className="card-title flex-fill">{props.title}</h1>,
          ...(props.headerItems || []),
        ]}
        bodyClassName="card-body py-0"
      >
        <ul className="list-group list-group-flush">
          {Object.keys(props.data).sort((a, b) => a.localeCompare(b)).map((key) => (
            <li key={key} className="px-0 list-group-item d-flex justify-content-between">
              <span className="text-capitalize">{key}</span>
              <span>{typeof props.data[key] === 'number' ? (props.data[key] as number).toFixed(3) : props.data[key]}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
};

export default DataCard;
