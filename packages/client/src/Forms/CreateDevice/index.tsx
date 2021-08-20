import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { faQuestion, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

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

const CreateDeviceForm: React.FC<CreateDeviceFormProps> = ({ open, close, onSubmit }) => (
  <Formik
    initialValues={{
      name: '',
      private: false,
    }}
    onSubmit={(
      values: CreateDeviceFormValues,
      { setSubmitting }: FormikHelpers<CreateDeviceFormValues>
    ) => {
      Promise.resolve(onSubmit(values)).then(() => setSubmitting(false));
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

export default CreateDeviceForm;
export { CreateDeviceFormValues };