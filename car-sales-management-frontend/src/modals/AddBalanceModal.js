import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import UserService from "../services/UserService";

const AddBalanceModal = (props) => {

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const [errors, setErrors] = useState({});
    const userService = UserService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};

    const [cardDetails, setCardDetails] = useState({
        "bankName": '',
        "accountNumber": '',
        "nameOnCard": '',
        "validThru": '',
        "securityCode": '',
        "amount": ''
    })


    const handleChange = (e) => {
        const { id, value } = e.target;

        const errorMessage = validateFields(e);
        if (errorMessage) {
            setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
        } else {
            setErrors({ ...errors, [id]: '' });
        }
        setCardDetails((prevCardInfo) => ({
            ...prevCardInfo,
            [id]: value,
        }));
    };

    const validateFields = (e) => {
        setErrors({});
        if (e.target.id.indexOf('bankName') > -1 && !e.target.value) {
            return "Bank name is mandatory";
        }
        if (e.target.id.indexOf('accountNumber') > -1 && !e.target.value) {
            return "Account number is mandatory";
        }
        if (e.target.id.indexOf('nameOnCard') > -1 && !e.target.value) {
            return "Name on card is mandatory";
        }
        if (e.target.id.indexOf('validThru') > -1) {
            if (!e.target.value) {
                return "Valid thru is mandatory";
            }
            if (!expiryRegex.test(e.target.value)) {
                return "Invalid expiration date format (MM/YY)";
            }
        }
        if (e.target.id.indexOf('securityCode') > -1) {
            if(!e.target.value) {
                return "Security Code is mandatory"
            }
            if(e.target.value.length !== 3) {
                return "Enter valid Security code";
            }
        }
        if (e.target.id.indexOf('amount') > -1 && !e.target.value) {
            //if (!e.target.value) {
            return "Amount is mandatory";
            } /*else if (e.target.value > 50000) {
                return "Cannot add more than $50000";
            }
        }*/

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasEmptyFields = Object.values(cardDetails).some(value => value === '');
        if (hasEmptyFields) {
            alert("All fields are required. Please fill in all the fields.");
            return;
        }
        /*if(cardDetails.amount > 50000) {
            alert("Cannot add more than $50000");
            return;
        }*/
        userService.addBalance(userDetails.id, userDetails.role, cardDetails.amount).then((response) => {
            if (response.status === 200) {
                props.setBalanceUpdated(true);
                localStorage.setItem("userDetails", JSON.stringify(response.data));
                alert("Balance added successfully");
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        props.setData(!props.data);
        props.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Balance
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='g-0 row gap-2'>
                    <div class="form-floating">
                        <input aria-label="input" type="text" id="bankName" class="form-control" placeholder='Bank Name' value={cardDetails.bankName} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="bankName">Bank Name*</label>
                        {errors.bankName && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.bankName}</div>}
                    </div>
                    <div class="form-floating">
                        <input aria-label="input" type="text" id="accountNumber" class="form-control" placeholder='Account Number' value={cardDetails.accountNumber} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="accountNumber">Account Number*</label>
                        {errors.accountNumber && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.accountNumber}</div>}
                    </div>
                    <div class="form-floating">
                        <input aria-label="input" type="text" id="nameOnCard" class="form-control" placeholder='Name on card' value={cardDetails.nameOnCard} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="nameOnCard">Name on card *</label>
                        {errors.nameOnCard && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.nameOnCard}</div>}
                    </div>
                    <div class="form-floating col-5">
                        <input aria-label="input" type="text" id="validThru" class="form-control" placeholder='Valid thru' value={cardDetails.validThru} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="validThru">Valid Thru*</label>
                        {errors.validThru && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.validThru}</div>}
                    </div>
                    <div class="form-floating col-5">
                        <input aria-label="input" type="text" id="securityCode" class="form-control" placeholder='Security code' value={cardDetails.securityCode} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="securityCode">Security code*</label>
                        {errors.securityCode && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.securityCode}</div>}
                    </div>
                    <div class="form-floating">
                        <input aria-label="input" type="text" id="amount" class="form-control" placeholder='amount' value={cardDetails.amount} onChange={handleChange} autoComplete="off" onBlur={handleChange} />
                        <label for="amount">Amount*</label>
                        {errors.amount && <div className="text-danger mt-2" style={{ fontSize: '12px' }}>{errors.amount}</div>}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddBalanceModal