'use client';

import { Modal, Button, Spinner } from 'react-bootstrap';

interface Props {
  show: boolean;
  onHide: () => void;
  services: any[];
  loading: boolean;
}

const ModalServicesAvail = ({ show, onHide, services, loading }: Props) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Available Services</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading services...</p>
          </div>
        ) : services.length ? (
          <ul className="list-group">
            {services.map((service, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <span>{service.service_name}</span>
                <span className="badge bg-success">{service.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">No services available.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalServicesAvail;
