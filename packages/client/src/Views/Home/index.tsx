import React from 'react';
import { useParams } from 'react-router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useGetDevicesQuery } from '../../Services/Data';
import Loader from '../../Components/Loader';
import Card from '../../Components/Card';
import Alert, { AlertType } from '../../Components/Alert';
import Row from '../../Components/Row';
import Column from '../../Components/Column';
import { Device as DeviceType } from '../../Types';

const Home: React.FC = () => {
  const { data, isLoading } = useGetDevicesQuery();
  return (
    <>
      <Loader show={isLoading} />
      <h1>Devices</h1>
      {!isLoading && data.length === 0 && (
        <Alert type={AlertType.Warning} icon={faSearch} message='No public devices found, maybe you have to guess the key of a private one?.' />
      )}
      <Row>
        {(data || []).map((device: DeviceType) => {
          return (
            <Column xs={12} md={4}>

            </Column>
          )
        })}
      </Row>
    </>
  );
}

export default Home;
