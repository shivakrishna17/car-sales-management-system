import axios from "axios";

const BASE_URL = "http://localhost:8080/api/address/";
const AddressService = () => {

    function saveAddress(obj) {
        return axios.post(BASE_URL + "saveAddress", obj);
    }

    function getUserAddress(userId) {
        return axios.get(BASE_URL + `getUserAddress/${userId}`);
    }

    function deleteAddress(addressId) {
        return axios.delete(BASE_URL + `deleteAddress/${addressId}`);
    }

    return Object.freeze({
        saveAddress,
        getUserAddress,
        deleteAddress
    });
}

export default AddressService;