import React, { useState } from 'react';
import moment from 'moment';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import Alert, { AlertType } from '../../Components/Alert';
import Button, { ButtonType } from '../../Components/Button';
import Column from '../../Components/Column';
import DataCard from '../../Components/DataCard';
import Loader from '../../Components/Loader';
import Row from '../../Components/Row';
import CreateDeviceForm, { CreateDeviceFormValues } from '../../Forms/CreateDevice';

import { useAddDeviceMutation, useGetDevicesQuery } from '../../Services/Data';
import { Device as DeviceType } from '../../Types';

const Home: React.FC = () => {
  const { data, isLoading, isError } = useGetDevicesQuery(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [ addDevice, { isLoading: isUpdating }] = useAddDeviceMutation()
  return (
    <>
      <Loader show={isLoading || isUpdating} />
      <div className='d-flex align-items-center mb-4'>
        <h1 className='flex-fill mb-0'> Devices</h1>
        <Button type={ButtonType.Primary} icon={faPlus} text='Create your own device!' onClick={() => setCreateOpen(true)} />
      </div>
      {!isLoading && (isError || data.length === 0) && (
        <Alert type={AlertType.Warning} icon={faSearch} message='No public devices found, maybe you have to guess the key of a private one?' />
      )}
      <Row>
        {(data || []).map((device: DeviceType) => {
          return (
            <Column key={device.publicKey} xs={12} md={6}>
              <DataCard
                title={device.name}
                data={{ 'Data Rows': device.numRows.toFixed(0), 'Last Entry': device.numRows === 0 ? 'Never' : moment(device.lastEntry).fromNow() }}
                headerItems={[
                  <Button key='view' link={'/' + device.publicKey} type={ButtonType.Primary} stretched={true} small={true} icon={faSearch} text='View Data' />
                ]}
              />
            </Column>
          )
        })}
      </Row>
      <CreateDeviceForm
        open={createOpen}
        close={() => setCreateOpen(false)}
        onSubmit={(payload: CreateDeviceFormValues) => addDevice({name: payload.name, private: payload.private})}
      />
    </>
  );
}

export default Home;
