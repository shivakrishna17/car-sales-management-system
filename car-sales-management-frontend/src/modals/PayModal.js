import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import '../css/style.css';
import OrderService from "../services/OrderService";

const PayModal = (props) => {

    const [paymentType, setPaymentType] = useState('fullPayment');
    const [installmentMonths, setInstallmentMonths] = useState(3);
    const [finalAmount, setFinalAmount] = useState(0);
    const selectedOrder = props.selectedOrder;
    const orderService = OrderService();

    useEffect(() => {
        if (paymentType === 'fullPayment') {
            setFinalAmount(selectedOrder.totalPrice);
        } else if (paymentType === 'installmentPayment') {
            setFinalAmount(calculateMonthlyPayment());
        }
    }, [paymentType, installmentMonths, selectedOrder.totalPrice]);

    const handleRadioChange = (event) => {
        setPaymentType(event.target.value);
    };

    const handleMonthChange = (event) => {
        setInstallmentMonths(parseInt(event.target.value, 10));
    };

    const calculateMonthlyPayment = () => {
        return (selectedOrder.totalPrice / installmentMonths).toFixed(2);

    };

    const handleSubmit = () => {
        orderService.confirmOrder(selectedOrder.id, paymentType, finalAmount).then((response) => {
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
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Select Payment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="radio-group">
                    <label>
                        <input type="radio" name="paymentType" value="fullPayment" checked={paymentType === 'fullPayment'} onChange={handleRadioChange} />
                        Full Payment
                    </label>
                    <label>
                        <input type="radio" name="paymentType" value="installmentPayment" checked={paymentType === 'installmentPayment'} onChange={handleRadioChange} />
                        Installment Payment
                    </label>
                </div>
                {paymentType === 'installmentPayment' && (
                    <Form.Group controlId="formInstallmentMonths" className="d-flex align-items-baseline mb-3">
                        <Form.Label className="me-3">Select Number of Months:</Form.Label>
                        <Form.Control as="select" className="profile" onChange={handleMonthChange} style={{ width: 'auto' }}>
                            <option value={3}>3 months</option>
                            <option value={6}>6 months</option>
                            <option value={12}>12 months</option>
                        </Form.Control>
                    </Form.Group>
                )}
                {paymentType === 'installmentPayment' && (
                    <p>Total Price for {installmentMonths} months: ${selectedOrder.totalPrice} </p>
                )}
                {paymentType === 'installmentPayment' && (
                    <p>Monthly Payment: ${calculateMonthlyPayment()} </p>
                )}
                {paymentType === 'fullPayment' && (
                    <p>Total Amount: ${selectedOrder.totalPrice} </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => handleSubmit()}>Pay</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PayModal;