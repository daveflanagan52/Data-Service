import React, { useState } from 'react';
import moment from 'moment';
import { faCheck, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import Alert, { AlertType } from '../../Components/Alert';
import Button, { ButtonType } from '../../Components/Button';
import Column from '../../Components/Column';
import DataCard from '../../Components/DataCard';
import Loader from '../../Components/Loader';
import Modal from '../../Components/Modal';
import Row from '../../Components/Row';

import { useGetDevicesQuery } from '../../Services/Data';
import { Device as DeviceType } from '../../Types';

const Home: React.FC = () => {
  const { data, isLoading } = useGetDevicesQuery(undefined);
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <>
      <Loader show={isLoading} />
      <div className='d-flex align-items-center'>
        <h1 className='flex-fill'> Devices</h1>
        <Button type={ButtonType.Primary} icon={faPlus} text='Create your own device!' onClick={() => setCreateOpen(true)} />
      </div>
      {!isLoading && data.length === 0 && (
        <Alert type={AlertType.Warning} icon={faSearch} message='No public devices found, maybe you have to guess the key of a private one?' />
      )}
      <Row>
        {(data || []).map((device: DeviceType) => {
          return (
            <Column key={device.key} xs={12} md={6}>
              <DataCard
                title={device.name}
                data={{ 'Data Rows': device.numRows.toFixed(0), 'Last Entry': moment(device.lastEntry).fromNow() }}
                headerItems={[
                  <Button key='view' link={'/' + device.key} type={ButtonType.Primary} stretched={true} small={true} icon={faSearch} text='View Data' />
                ]}
              />
            </Column>
          )
        })}
      </Row>
      <Modal
        open={createOpen}
        title='Create your own device!'
        close={() => setCreateOpen(false)}
        footerItems={[
          <Button key='cancel' type={ButtonType.Secondary} icon={faTimes} text='Cancel' onClick={() => setCreateOpen(false)} />,
          <Button key='submit' type={ButtonType.Primary} icon={faCheck} text='Submit' />,
        ]}
      >

      </Modal>
    </>
  );
}

export default Home;
