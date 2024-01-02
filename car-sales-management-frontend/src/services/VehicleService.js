import axios from "axios";

const BASE_URL = "http://localhost:8080/api/vehicle/";
const VehicleService = () => {

    function addVehicle(formData, userId) {
        return axios.post(BASE_URL + `addVehicle/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    function getVehicles(userId, userRole) {
        return axios.get(BASE_URL + 'getVehicles', {
            params: { userId, userRole }
        });
    }

    function updateCarById(formData, carId, userId) {
        return axios.put(BASE_URL + `updateVehicle/${carId}`, formData, {
            params: { userId }
        });
    }

    function deleteCarById(carId) {
        return axios.delete(BASE_URL + `deleteVehicle/${carId}`);
    }

    function approveVehicle(carId, userId, userRole, commissionPercent) {
        return axios.post(BASE_URL + `approveVehicle/${carId}`, null, {
            params: { userId, userRole, commissionPercent }
        });
    }

    function rejectVehicle(carId, userId, userRole, reason) {
        return axios.post(BASE_URL + `rejectVehicle/${carId}`, null, {
            params: { userId, userRole, reason }
        });
    }

    function getVehiclesBySort(sortBy, sortOrder) {
        return axios.get(BASE_URL + `getVehiclesBySort`, {
            params: { sortBy, sortOrder }
        })
    }

    function searchByCarMake(searchKey, userId, userRole) {
        return axios.get(BASE_URL + `searchByCarName`, {
            params: { searchKey, userId, userRole }
        })
    }

    function getVehicleByStatus(statusList, userId, userRole) {
        return axios.get(BASE_URL + `vehiclesByStatus`, {
            params: { statusList, userId, userRole }
        })
    }

    return Object.freeze({
        getVehicles,
        addVehicle,
        updateCarById,
        deleteCarById,
        approveVehicle,
        rejectVehicle,
        getVehiclesBySort,
        searchByCarMake,
        getVehicleByStatus
    });
}

export default VehicleService;