import React, { useState, useEffect } from "react";
import VehicleService from "../services/VehicleService";
import ViewModal from "../modals/ViewModal";

const SearchBar = () => {
    const vehicleService = VehicleService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [searchKey, setSearchKey] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        if (searchKey.length >= 3) {
            vehicleService.searchByCarMake(searchKey, userDetails.id, userDetails.role).then((response) => {
                if (response.status === 200) {
                    setSearchResults(response.data);
                }
            }).catch((error) => {
                if (!error.response && error.message != null) {
                    alert(error.message);
                } else if (error.response.status >= 400) {
                    alert(error.response.data);
                }
            });
        } else {
            setSearchResults([]);
        }
    }, [searchKey]);

    const handleInputChange = (event) => {
        setSearchKey(event.target.value);
        onCarSelect(event);
    };

    const onCarSelect = (event) => {
        const carOption = searchResults.find((car) => `${car.carMake} ${car.carModel}` === event.target.value);
        if (carOption) {
            setViewModal(true);
            setSelectedCar(carOption);
        } else {
            setViewModal(false);
            setSelectedCar(null);
        }
    }

    return (
        <>
            <input className="form-control w-25" list="datalistOptions" id="exampleDataList" placeholder="Search by car name..." onChange={handleInputChange} autoComplete="off" />
            <datalist id="datalistOptions" >
                {searchResults.map((car, index) => (
                    <option key={index} value={`${car.carMake} ${car.carModel}`} />
                ))}
            </datalist>
            {viewModal && <ViewModal show={viewModal} onHide={() => setViewModal(!viewModal)} selectedCar={selectedCar} />}
        </>
    );
};

export default SearchBar;
