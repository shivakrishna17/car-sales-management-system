import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";
import HeaderComponent from "./HeaderComponent";
import { getStatus } from "../Helper/Helper";
import ViewOrderModal from "../modals/ViewOrderModal";
import ViewModal from "../modals/ViewModal";
import PayModal from "../modals/PayModal";
import ShippingChargeModal from "../modals/ShippingChargeModal";

const OrderRequest = () => {

    const orderService = OrderService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [orderDetails, setOrderDetails] = useState([]);
    const [request, setRequest] = useState(false);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewOrderModal, setViewOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [vehicleModal, setVehicleModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState({});
    const [approveModal, setApproveModal] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        getAllOrderRequests();
    }, [request]);


    const getAllOrderRequests = () => {
        setIsLoading(true)
        orderService.getAllOrderRequests(userDetails.id, userDetails.role).then((response) => {
            if (response.status === 200) {
                setOrderDetails(response.data);
                setIsLoading(false);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
            setOrderDetails([]);
            setIsLoading(false);
        });
    }

    const handleReject = (orderId) => {
        orderService.rejectOrder(orderId).then((response) => {
            if (response.status === 200) {
                alert(response.data);
            }
            setRequest(!request);
            window.location.reload();
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
    }

    const handleCancel = (orderId) => {
        orderService.cancelOrder(orderId).then((response) => {
            if (response.status === 200) {
                alert(response.data);
            }
            setRequest(!request);
            window.location.reload();
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
    }

    const handleApprove = (orderId) => {
        setApproveModal(!approveModal);
        setOrderId(orderId);
    }
    
    const togglePayModal = (index) => {
        setOpenPayModal(!openPayModal);
        setSelectedOrder(orderDetails[index]);
    }

    const handleView = (index) => {
        setViewOrderModal(!viewOrderModal);
        setSelectedOrder(orderDetails[index]);
    }

    const handleVehicleView = (index) => {
        setVehicleModal(!vehicleModal);
        setSelectedCar(orderDetails[index].vehicle);
    }

    return (
        <>
            <HeaderComponent request={request} />
            {orderDetails.length > 0 && <>
                <h2 className="d-flex justify-content-center mt-3">{`${userDetails.role === "B" ? "My Orders" : "Your Orders"}`}</h2>
                <table class="table table-bordered container mt-4">
                    <thead>
                        <tr>
                            <th scope="col">Car Name</th>
                            <th scope="col">Car Model</th>
                            {userDetails.role !== "B" && <th scope="col">Buyer</th>}
                            {userDetails.role !== "S" && <th scope="col">Seller</th>}
                            <th scope="col">Bidding Price</th>
                            <th scope='col'>Order Status</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderDetails.length > 0 && orderDetails.map((eachOrder, index) => {
                                return (
                                    <>
                                        <tr>
                                            <th scope="row">
                                                <a className="profile" onClick={() => handleVehicleView(index)}>{eachOrder.vehicle?.carMake}</a>
                                            </th>
                                            <td>{eachOrder.vehicle?.carModel}</td>
                                            {userDetails.role !== "B" && <td>{eachOrder.buyerName}</td>}
                                            {userDetails.role !== "S" && <td>{eachOrder.sellerName}</td>}
                                            <td>${eachOrder.payablePrice}</td>
                                            <td>{getStatus(eachOrder.orderStatus)}</td>
                                            <td>
                                                <button className='btn-primary btn me-2' onClick={() => handleView(index)}>View</button>
                                                {userDetails.role === "S" && eachOrder.orderStatus === "I" && <>
                                                    <button className='btn-success btn me-2' onClick={() => handleApprove(eachOrder.id)}>Approve</button>
                                                    <button className='btn-danger btn' onClick={() => handleReject(eachOrder.id)}>Reject</button>
                                                </>}
                                                {userDetails.role === "B" && eachOrder.orderStatus === "A" && <>
                                                    <button className='btn-success btn me-2' onClick={() => togglePayModal(index)}>Pay</button>
                                                    <button className='btn-danger btn' onClick={() => handleCancel(eachOrder.id)}>Cancel</button>
                                                </>}
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </>
            }
            {!isLoading && orderDetails.length <= 0 && <div className="d-flex align-items-center justify-content-center" style={{ height: '75vh' }}>
                <h3 className="no-data-box">No Orders Found</h3>
            </div>}
            {isLoading && <div className='align-items-center d-flex justify-content-center' style={{ "height": "75vh" }}><div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div></div>}
            {viewOrderModal && <ViewOrderModal show={viewOrderModal} onHide={() => { setViewOrderModal(!viewOrderModal) }} selectedOrder={selectedOrder} />}
            {vehicleModal && <ViewModal show={vehicleModal} onHide={() => { setVehicleModal(!vehicleModal) }} selectedCar={selectedCar} />}
            {openPayModal && <PayModal show={openPayModal} onHide={() => { setOpenPayModal(!openPayModal) }} selectedOrder={selectedOrder} setRequest={setRequest} request={request} />}
            {approveModal && <ShippingChargeModal show={approveModal} onHide={() => { setApproveModal(!approveModal) }} orderId={orderId} />}
        </>
    )
}

export default OrderRequest;