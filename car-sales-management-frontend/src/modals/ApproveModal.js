import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import VehicleService from '../services/VehicleService';

const ApproveModal = ({ carId, request, setRequest, ...props }) => {
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const vehicleService = VehicleService();
    const [error, setError] = useState(null);
    const [commissionPercent, setCommissionPercent] = useState('');
    const [disable, setDisable] = useState(false);

    const handleInputChange = (e) => {
        setError('');
        const inputValue = e.target.value;
        if (!inputValue) {
            setError('Commission Percent is mandatory');
            setDisable(false);
        } else if (inputValue > 30) {
            setError('Commission Percent cannot be more than 30%');
            setDisable(false);
        } else {
            setCommissionPercent(inputValue);
            setDisable(true);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && commissionPercent.length > 0) {
            setCommissionPercent(commissionPercent.slice(0, -1));
        }
    };

    const handleApprove = () => {
        vehicleService.approveVehicle(carId, userDetails.id, userDetails.role, commissionPercent).then((response) => {
            if (response.status === 200) {
                alert(response.data);
            }
            window.location.reload();
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
                <Modal.Title id="contained-modal-title-vcenter">
                    Approve Car
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='g-0 row gap-2'>
                    <div class="form-floating col-3 ">
                        <input aria-label="input" type="text" id="commissionPercent" class="form-control" placeholder='Commission Percentage' value={commissionPercent} onChange={handleInputChange}  autoComplete="off" onBlur={handleInputChange} onKeyDown={handleKeyDown}/>
                        <label for="commissionPercent">Commission Percent*</label>
                        {error && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{error}</div>}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleApprove}  disabled={!disable}>Approve</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ApproveModal