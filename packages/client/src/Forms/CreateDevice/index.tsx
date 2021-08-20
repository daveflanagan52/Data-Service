import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { faCheck, faQuestion, faSave, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import Button, { ButtonType } from '../../Components/Button';
import FormLabel from '../../Components/FormLabel';
import FormCheckSwitch from '../../Components/FormikInput/FormCheckSwitch';
import FormInput, { FormInputType } from '../../Components/FormikInput/FormInput';
import Modal from '../../Components/Modal';
import Alert, { AlertType } from '../../Components/Alert';

type CreateDeviceFormProps = {
  open: boolean,
  close: Function,
  onSubmit: Function,
};

interface CreateDeviceFormValues {
  name: string;
  private: boolean;
};

const CreateDeviceForm: React.FC<CreateDeviceFormProps> = ({ open, close, onSubmit }) => {
  const [device, setDevice] = useState(undefined);
  if (device) {
    return (
      <Modal
        title='Create your own device!'
        open={open}
        close={close}
        footerItems={[
          <Button key='view' type={ButtonType.Primary} icon={faSearch} text='View Device' link={'/' + device.publicKey} />,
        ]}
      >
        <Alert type={AlertType.Success} icon={faCheck} message='Your device was created successfully. Please make a note of the below keys, they will not be shown again.' />
        <ul className='list-group list-group-flush'>
          <li className='px-0 list-group-item d-flex justify-content-between'>
            <span>Name</span>
            <span>{device.name}</span>
          </li>
          <li className='px-0 list-group-item d-flex justify-content-between'>
            <span>Private</span>
            <span>{device.private ? 'True' : 'False'}</span>
          </li>
          <li className='px-0 list-group-item d-flex justify-content-between'>
            <span>Private Key</span>
            <span>{device.privateKey}</span>
          </li>
          <li className='px-0 list-group-item d-flex justify-content-between'>
            <span>Public Key</span>
            <span>{device.publicKey}</span>
          </li>
        </ul>
        <h5 className='mt-4'>Useage Example</h5>
        <Alert type={AlertType.Info} icon={faQuestion} message='Use the private key to upload data, never share this key and keep it safe. Use the public key to access the device in the UI.' />
        <pre style={{ color: '#000000', marginBottom: 0 }}>curl -X <span style={{ color: '#0000e6' }}>'POST'</span> <span style={{ color: '#0f69ff' }}>\</span></pre>
        <pre style={{ color: '#000000', marginBottom: 0 }}>  <span style={{ color: '#0000e6' }}>'https://data.daveflanagan.ovh/api/v1/data/{device.privateKey}'</span> <span style={{ color: '#0f69ff' }}>\</span></pre>
        <pre style={{ color: '#000000', marginBottom: 0 }}>  -H <span style={{ color: '#0000e6' }}>'accept: application/json'</span> <span style={{ color: '#0f69ff' }}>\</span></pre>
        <pre style={{ color: '#000000', marginBottom: 0 }}>  -H <span style={{ color: '#0000e6' }}>'Content-Type: application/json'</span> <span style={{ color: '#0f69ff' }}>\</span></pre>
        <pre style={{ color: '#000000', marginBottom: 0 }}>  <span style={{ color: '#44aadd' }}>-d</span> <span style={{ color: '#0000e6' }}>'{'{'}"temperature":23.512{'}'}'</span></pre>
      </Modal>
    )
  }
  return (
    <Formik
      initialValues={{
        name: '',
        private: false,
      }}
      onSubmit={(
        values: CreateDeviceFormValues,
        { setSubmitting }: FormikHelpers<CreateDeviceFormValues>
      ) => {
        Promise.resolve(onSubmit(values))
          .then(device => setDevice(device.data))
          .then(() => setSubmitting(false));
      }}
    >
      {props => (
        <Form>
          <Modal
            title='Create your own device!'
            open={open}
            close={close}
            footerItems={[
              <Button key='cancel' type={ButtonType.Secondary} icon={faTimes} text='Cancel' onClick={() => close()} />,
              <Button key='submit' type={ButtonType.Primary} icon={faSave} text='Submit' />,
            ]}
          >
            <Alert type={AlertType.Info} icon={faQuestion} message='Note: This information cannot be changed once a device is created. Devices that do not upload data for more than a month will be removed.' />
            <div className='mb-3'>
              <FormLabel text='Name' htmlFor='name' />
              <FormInput id='name' name='name' type={FormInputType.Text} value='' />
            </div>
            <FormCheckSwitch id='private' name='private' value={true} text='Private?' />
            {props.values.private && <Alert type={AlertType.Info} icon={faQuestion} message='When set to private a device will not be shown in publically viewable lists, and will only be accessible via a unique URL.' />}
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default CreateDeviceForm;
export { CreateDeviceFormValues };