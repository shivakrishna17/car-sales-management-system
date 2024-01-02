import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import VehicleService from "../services/VehicleService";

const ReasonModal = (props) => {

    const carId = props.carId;
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const vehicleService = VehicleService();
    const [rejectReason, setRejectReason] = useState(null);
    const [error, setError] = useState(null);
    const [disable, setDisable] = useState(false);

    const handleChange = (e) => {
        setError('');
        if (!e.target.value) {
            setError('Enter Reason');
            setDisable(false);
        } else {
            setRejectReason(e.target.value);
            setDisable(true);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && rejectReason.length > 0) {
            setRejectReason(rejectReason.slice(0, -1));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rejectReason == null) {
            alert("Reason is mandatory");
            return;
        }
        vehicleService.rejectVehicle(carId, userDetails.id, userDetails.role, rejectReason).then((response) => {
            if (response.status === 200) {
                alert(response.data);
            }
            props.setRequest(!props.request);
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        props.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter Reason</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <div>
                            <div class="form-floating mb-3 ">
                                <input aria-label="input" type="text" id="reason" class="form-control" placeholder='reason' value={rejectReason} onChange={handleChange} onBlur={handleChange} onKeyDown={handleKeyDown} />
                                <label for="reason">Reason*</label>
                                {error && <div className="text-danger">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} disabled={!disable}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReasonModal