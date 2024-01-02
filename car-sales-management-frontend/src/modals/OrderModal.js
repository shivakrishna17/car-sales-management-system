import React, { useState } from "react";
import OrderService from "../services/OrderService";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const OrderModal = ({ index, carId, addressId, ...props }) => {

    const [price, setPrice] = useState(null);
    const [error, setError] = useState(null);
    const [disable, setDisable] = useState(false);
    const orderService = OrderService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};

    const handleChange = (e) => {
        setError('');
        if (!e.target.value) {
            setError('Enter bidding price');
            setDisable(false);
        } else {
            setPrice(e.target.value);
            setDisable(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && price.length > 0) {
            setPrice(price.slice(0, -1));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (price == null) {
            alert("Bidding price is mandatory");
            return;
        }
        if (!error) {
            orderService.createOrder(userDetails.id, carId, price, addressId).then((response) => {
                if (response.status === 200) {
                    alert(response.data);
                }
                props.setRequest(!props.request);
            }).catch((error) => {
                if (!error.response) {
                    alert("Something went wrong");
                } else if (error.response.status >= 400) {
                    alert(error.response.data);
                }
            });
            props.onHide();
        }
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Order Summary
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <div>
                            <div class="form-floating mb-3 ">
                                <input aria-label="input" type="text" id="price" class="form-control" placeholder='price' value={price} onChange={handleChange} autoComplete="off" onBlur={handleChange} autoFocus onKeyDown={handleKeyDown} />
                                <label for="price">Bidding price *</label>
                                {error && <div className="text-danger">{error}</div>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p><b>Note</b> - Shipping charges are calculated based on the address location</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} disabled={!disable}>Submit Order</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrderModal;