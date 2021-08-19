import React from 'react';

import Card from '../Card';

interface DataCardProps {
  title: string,
  data: { [key: string]: number },
};

const DataCard: React.FC<DataCardProps> = (props: DataCardProps) => {
  return (
    <>
      <Card headerItems={[<h1 className='card-title'>{props.title}</h1>]} bodyClassName='card-body py-0'>
        <ul className='list-group list-group-flush'>
          {Object.keys(props.data).map(key => <li key={key} className='px-0 list-group-item d-flex justify-content-between'><span className='text-capitalize'>{key}</span><span>{props.data[key].toFixed(2)}</span></li>)}
        </ul>
      </Card>
    </>
  );
}

export default DataCard;