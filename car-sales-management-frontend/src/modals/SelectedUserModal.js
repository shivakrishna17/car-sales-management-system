import React from "react";
import { formatDate } from "../Helper/Helper";
import { Modal } from "react-bootstrap";

const SelectedUserModal = (props) => {

    const selectedUser = props.selectedUser;
    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Seller Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="sellerName" className="form-control-plaintext" value={selectedUser.name} />
                            <label htmlFor="sellerName">Seller Name</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="phonenumber" className="form-control-plaintext" value={selectedUser.phonenumber} />
                            <label htmlFor="phonenumber">Mobile Number</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="email" className="form-control-plaintext" value={selectedUser.email} />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="ssn" className="form-control-plaintext" value={selectedUser.ssn} />
                            <label htmlFor="ssn">SSN</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="location" className="form-control-plaintext" value={selectedUser.location} />
                            <label htmlFor="location">Location</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="requestedDate" className="form-control-plaintext" value={`${formatDate(selectedUser.dateCreated)}`} />
                            <label htmlFor="requestedDate">Requested Date</label>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SelectedUserModal;