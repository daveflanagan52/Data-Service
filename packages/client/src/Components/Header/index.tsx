import { faDatabase, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Container from '../Container';
import Column from '../Column';
import Row from '../Row';
import Button, { ButtonType } from '../Button';
import CreateDeviceForm, { CreateDeviceFormValues } from '../../Forms/CreateDevice';
import { useAddDeviceMutation } from '../../Services/Data';
import Loader from '../Loader';

const Header: React.FC = () => {
  const location = useLocation();
  const showWelcome = location.pathname === '/';
  const [createOpen, setCreateOpen] = useState(false);
  const [addDevice, { isLoading }] = useAddDeviceMutation();
  return (
    <header>
      <Loader show={isLoading} />
      <Container>
        <Link to="/" className="navbar-brand">
          <FontAwesomeIcon className="me-2 text-primary" icon={faDatabase} />
          Data Service
        </Link>
        {showWelcome && (
          <>
            <Row>
              <Column md={6}>
                <p>Data service is a data repository that stores any key/numeric value pair sent to it in the body of a request.</p>
                <p>You can create your own device and send data to it, private or public your choice.</p>
              </Column>
              <Column md={6} className="d-flex align-items-start">
                <Button type={ButtonType.Primary} icon={faPlus} text="Create your own device!" onClick={() => setCreateOpen(true)} className="ms-auto" />
              </Column>
            </Row>
          </>
        )}
      </Container>
      <CreateDeviceForm
        open={createOpen}
        close={() => setCreateOpen(false)}
        onSubmit={(payload: CreateDeviceFormValues) => addDevice({ name: payload.name, private: payload.private })}
      />
      <div className="divider-shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="shape-waves">
          <path className="shape-fill shape-fill-1" d="M790.5,93.1c-59.3-5.3-116.8-18-192.6-50c-29.6-12.7-76.9-31-100.5-35.9c-23.6-4.9-52.6-7.8-75.5-5.3c-10.2,1.1-22.6,1.4-50.1,7.4c-27.2,6.3-58.2,16.6-79.4,24.7c-41.3,15.9-94.9,21.9-134,22.6C72,58.2,0,25.8,0,25.8V100h1000V65.3c0,0-51.5,19.4-106.2,25.7C839.5,97,814.1,95.2,790.5,93.1z" />
        </svg>
      </div>
    </header>
  );
};

export default Header;
