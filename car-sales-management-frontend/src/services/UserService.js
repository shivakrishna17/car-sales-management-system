import axios from "axios";

const BASE_URL = "http://localhost:8080/api/user/";
const UserService = () => {

    function getUserDetails(userId, userRole) {
        return axios.get(BASE_URL + "getUserDetails",  {
            params: { userId, userRole }
        });
    }

    function registerUser(obj) {
        return axios.post(BASE_URL + "register", obj);
    }

    function loginUser(obj) {
        return axios.post(BASE_URL + "login", obj);
    }

    function addBalance(userId, userRole, amount) {
        return axios.post(BASE_URL + `addBalance/${userId}`, null, {
            params :{ userRole, amount }
        })
    }

    function getUserRequests(userId) {
        return axios.get(BASE_URL + "getUserRequests",  {
            params: { userId }
        });
    }

    function getSellerRequests() {
        return axios.get(BASE_URL + "getSellerRequests");
    }

    function approveUser(userId) {
        return axios.post(BASE_URL + `approveUser/${userId}`)
    }

    function rejectUser(userId) {
        return axios.post(BASE_URL + `rejectUser/${userId}`)
    }

    return Object.freeze({
        registerUser,
        loginUser,
        addBalance,
        getUserDetails,
        getUserRequests,
        getSellerRequests,
        approveUser,
        rejectUser
    });
}

export default UserService;