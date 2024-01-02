import axios from "axios";

const BASE_URL = "http://localhost:8080/api/order/";
const OrderService = () => {
    function createOrder(buyerId, vehicleId, price, addressId) {
        return axios.post(BASE_URL + `createOrder/${vehicleId}`, null, {
            params: { buyerId, price, addressId }
        });
    }

    const getAllOrderRequests = (userId, userRole) => {
        return axios.get(BASE_URL + `getAllOrderRequests/${userId}`, {
            params: { userRole }
        });
    }

    const approveOrder = (orderId, shippingCharges) => {
        return axios.post(BASE_URL + `approveOrder/${orderId}`, null, {
            params: {shippingCharges}
        });
    }

    const rejectOrder = (orderId) => {
        return axios.post(BASE_URL + `rejectOrder/${orderId}`);
    }

    const confirmOrder = (orderId, paymentType, price) => {
        return axios.post(BASE_URL + `confirmOrder/${orderId}`, null ,{
            params: { paymentType, price }
        });
    }

    const cancelOrder = (orderId) => {
        return axios.post(BASE_URL + `cancelOrder/${orderId}`);
    }

    return Object.freeze({
        createOrder,
        getAllOrderRequests,
        approveOrder,
        rejectOrder,
        confirmOrder,
        cancelOrder
    });
}

export default OrderService;