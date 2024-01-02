import React from "react";
import { Modal } from "react-bootstrap";
import { formatDate } from "../Helper/Helper";

const ViewOrderModal = (props) => {

    const selectedOrder = props.selectedOrder;
    const payablePrice = selectedOrder.payablePrice;
    const shippingCharges = selectedOrder.shippingCharges;
    const commissionPercent = selectedOrder.vehicle?.commisionPercentage;
    const adminShare = ((payablePrice * commissionPercent) / 100).toFixed(2);
    const sellerShare = ((payablePrice - adminShare) + shippingCharges).toFixed(2);

    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Order Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="carMake" className="form-control-plaintext" value={selectedOrder.vehicle?.carMake} />
                            <label htmlFor="carMake">Car Make</label>
                        </div>
                       {selectedOrder.totalPrice > 0 && <div className="form-floating">
                            <input aria-label="text input" type="text" id="totalPrice" className="form-control-plaintext" value={`$${selectedOrder.totalPrice}`} />
                            <label htmlFor="totalPrice">Total Price</label>
                        </div>}
                        {sellerShare > 0 && <div className="form-floating">
                            <input aria-label="text input" type="text" id="sellerShare" className="form-control-plaintext" value={`$${sellerShare}`} />
                            <label htmlFor="sellerShare">Seller Share</label>
                        </div>}
                        {!selectedOrder.soldDate && selectedOrder.requestedDate && <div className="form-floating">
                            <input aria-label="text input" type="text" id="requestedDate" className="form-control-plaintext" value={`${formatDate(selectedOrder.requestedDate)}`} />
                            <label htmlFor="requestedDate">Request Date</label>
                        </div>}
                        {selectedOrder.soldDate && <div className="form-floating">
                            <input aria-label="text input" type="text" id="soldDate" className="form-control-plaintext" value={`${formatDate(selectedOrder.soldDate)}`} />
                            <label htmlFor="soldDate">Sold Date</label>
                        </div>}
                    </div>
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="biddingPrice" className="form-control-plaintext" value={`$${selectedOrder.payablePrice}`} />
                            <label htmlFor="biddingPrice">Bidding Price</label>
                        </div>
                        {selectedOrder.shippingCharges > 0 && <div className="form-floating">
                            <input aria-label="text input" type="text" id="shippingCharges" className="form-control-plaintext" value={`$${selectedOrder.shippingCharges}`} />
                            <label htmlFor="shippingCharges">Shipping Charges</label>
                        </div>}
                        {adminShare > 0 &&<div className="form-floating">
                            <input aria-label="text input" type="text" id="adminShare" className="form-control-plaintext" value={`$${adminShare}`} />
                            <label htmlFor="adminShare">Admin Share</label>
                        </div>}
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="location" className="form-control-plaintext" value={selectedOrder.address.city+', ' +selectedOrder.address.state+', '+selectedOrder.address.zipcode} />
                            <label htmlFor="location">Location</label>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ViewOrderModal;