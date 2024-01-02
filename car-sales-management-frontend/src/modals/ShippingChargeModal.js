import React, { useState } from "react";
import OrderService from "../services/OrderService";
import { Button, Modal } from "react-bootstrap";

const ShippingChargeModal = (props) => {

    const orderId = props.orderId
    const orderService = OrderService();
    const [error, setError] = useState(null);
    const [shippingCharges, setShippingCharges] = useState('');
    const [disable, setDisable] = useState(false);

    const handleInputChange = (e) => {
        setError('');
        const inputValue = e.target.value;
        if (!inputValue) {
            setError('Shipping Charges is mandatory');
            setDisable(false);
        } else {
            setShippingCharges(inputValue);
            setDisable(true);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && shippingCharges.length > 0) {
            setShippingCharges(shippingCharges.slice(0, -1));
        }
    };

    const handleApprove = () => {
        orderService.approveOrder(orderId, shippingCharges).then((response) => {
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

    return(
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Approve Order
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='g-0 row gap-2'>
                    <div class="form-floating col-3 ">
                        <input aria-label="input" type="text" id="shippingCharges" class="form-control" placeholder='Shipping Charges' value={shippingCharges} onChange={handleInputChange}  autoComplete="off" onBlur={handleInputChange} onKeyDown={handleKeyDown}/>
                        <label for="shippingCharges">Shipping Charges*</label>
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

export default ShippingChargeModal;