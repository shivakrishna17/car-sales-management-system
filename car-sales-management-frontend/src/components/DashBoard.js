import React, { useEffect, useState } from 'react';
import { getPurchaseStatus, getStatus } from '../Helper/Helper';
import ViewModal from '../modals/ViewModal';
import EditModal from '../modals/EditModal';
import HeaderComponent from './HeaderComponent';
import VehicleService from '../services/VehicleService';
import AddressModal from '../modals/AddressModal';
import OrderModal from '../modals/OrderModal';
import '../css/style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import AddCarModal from '../modals/AddCarModal';
import SearchBar from './SearchBar';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import ReasonModal from '../modals/ReasonModal';
import ApproveModal from '../modals/ApproveModal';


const DashBoard = () => {
    const navigate = useNavigate()
    const userService = UserService();
    const vehicleService = VehicleService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [carsInfo, setCarsInfo] = useState([]);
    const [selectedCar, setSelectedCar] = useState({});
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editCarInfo, setEditCarInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addressModal, setAddressModal] = useState(false);
    const [orderModal, setOrderModal] = useState(false);
    const [reasonModal, setReasonModal] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [request, setRequest] = useState(false);
    const [addressId, setAddressId] = useState('');
    const [carId, setCarId] = useState(undefined);
    const [viewModal, setViewModal] = useState(false);
    const [isAddCar, setAddCar] = useState(false);
    const [requestIds, setRequestIds] = useState([]);
    const [initialLoader, setInitialLoader] = useState(true);
    const [vehiclesCount, setVehicleCount] = useState(undefined);
    const [statuses, setSelectedStatuses] = useState([
        { name: "initiated", value: 'I', selected: false },
        { name: "approved", value: 'A', selected: false },
        { name: "rejected", value: 'R', selected: false }
    ]);

    useEffect(() => {
        setIsLoading(true);
        if (userDetails == null || userDetails.id == null) {
            navigate("/login");
            return;
        }
        if (initialLoader || !statuses.some(status => status.selected)) {
            getVehicles();
            getUserRequests();
            setInitialLoader(false);
        } else {
            let selectedStatuses = [];
            statuses.forEach(element => {
                if (element.selected) {
                    selectedStatuses.push(element.value);
                }
            });
            sendStatusListRequest(selectedStatuses.join(","));
        }
    }, [request, statuses]);

    const getUserRequests = () => {
        userService.getUserRequests(userDetails.id).then((response) => {
            if (response.status === 200) {
                setRequestIds(response.data);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        setIsLoading(false);
    }

    const getVehicles = () => {
        vehicleService.getVehicles(userDetails.id, userDetails.role).then((response) => {
            if (response.status === 200) {
                setCarsInfo(response.data);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
            setCarsInfo([]);
        })
        setIsLoading(false);
    }

    const handleEditClick = (index) => {
        if (index >= 0 && index < carsInfo.length) {
            setEditCarInfo(carsInfo[index]);
            setEditModalOpen(true);
        }
    }

    const handleDeleteClick = (carId) => {
        vehicleService.deleteCarById(carId).then((response) => {
            if (response.status === 200) {
                alert(response.data);
            }
            setRequest(!request);
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        setIsLoading(false);
    }

    const handleReject = (carId) => {
        setReasonModal(!reasonModal);
        setCarId(carId);
    }

    const toggleAddressModal = (carId) => {
        setAddressModal(!addressModal);
        setCarId(carId)
    }

    const handleView = (index) => {
        setViewModal(!viewModal);
        setSelectedCar(carsInfo[index]);
    }

    const handleSort = (sortBy, sortOrder) => {
        vehicleService.getVehiclesBySort(sortBy, sortOrder).then((response) => {
            if (response.status === 200) {
                setCarsInfo(response.data);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        })
        setIsLoading(false);
    }

    const handleApprove = (carId) => {
        setApproveModal(!approveModal);
        setCarId(carId);
    }

    const handleCheckboxChange = (index, event) => {
        let currentStatuses = statuses;
        currentStatuses[index].selected = event.target.checked;
        setSelectedStatuses([...currentStatuses]);
    };

    const sendStatusListRequest = (statusList) => {
        vehicleService.getVehicleByStatus(statusList, userDetails.id, userDetails.role).then((response) => {
            if (response.status === 200) {
                setCarsInfo(response.data.vehiclesList);
                setVehicleCount(response.data.vehiclesCount);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
            setCarsInfo([]);
            setVehicleCount(undefined);
        })
        setIsLoading(false);
    }

    return (
        <>
            <HeaderComponent />
            <div className={`${(carsInfo.length > 0 || vehiclesCount) ? "d-flex" : ""} align-items-center justify-content-between p-1`} >
                {(carsInfo.length > 0 || vehiclesCount) && <SearchBar />}
                <div className='d-flex align-items-center justify-content-end'>
                    {((carsInfo.length > 0 || vehiclesCount) && userDetails.role !== "B") && statuses.map(({ value, selected, name: statusName }, index) => {
                        return (
                            <div className='me-2'>
                                <input type='checkbox' id={statusName} value={value} checked={selected} onChange={(e) => handleCheckboxChange(index, e)} />
                                <label htmlFor={statusName} className='mx-1'>{statusName}</label>
                            </div>
                        )
                    })}
                    {((carsInfo.length > 0 || vehiclesCount) && userDetails.role !== "B") && <div className='me-2'>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic"> Sort By </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleSort("carPrice", "asc")}>Price (Asc - Desc)</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSort("carPrice", "desc")}>Price (Desc - Asc)</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>}
                    {userDetails.role === "S" &&
                        <div className='justify-content-end mt-2'>
                            <AddCarModal show={isAddCar} onHide={() => { setAddCar(!isAddCar) }} isLoading={isLoading} setIsLoading={setIsLoading} />
                            <button className='btn-primary btn me-3 mb-2 px-3' style={{ whiteSpace: 'nowrap' }} onClick={() => { setAddCar(!isAddCar) }}>Add Car</button>
                        </div>
                    }
                </div>
            </div>
            {carsInfo.length > 0 && <table class="table table-bordered container mt-3">
                <thead>
                    <tr>
                        <th scope="col">Car Make</th>
                        <th scope="col">Car Modal</th>
                        <th scope="col">Price</th>
                        {userDetails.role !== "B" && <th scope="col">Status</th>}
                        {userDetails.role === "S" && <th scope='col'>Remarks</th>}
                        <th scope='col'>Purchase Status</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {carsInfo.map((eachCar, index) => {
                        return (
                            <>
                                <tr>
                                    <th scope="row">{eachCar.carMake}</th>
                                    <td>{eachCar.carModel}</td>
                                    <td>$ {eachCar.carPrice}</td>
                                    {userDetails.role !== "B" && <td>{getStatus(eachCar.status)}</td>}
                                    {userDetails.role === "S" && <td>{`${eachCar.reason ? eachCar.reason : ''}`}</td>}
                                    <td>{getPurchaseStatus(eachCar.purchaseStatus)}</td>
                                    <td>
                                        <button className='btn-primary btn me-2' onClick={() => { handleView(index) }}>View</button>
                                        {userDetails.role === "A" && eachCar.status === "I" && <>
                                            <button className='btn-success btn me-2' onClick={() => handleApprove(eachCar.id)}>Approve</button>
                                            <button className='btn-danger btn' onClick={() => handleReject(eachCar.id)}>Reject</button>
                                        </>
                                        }
                                        {userDetails.role === "B" && !requestIds.includes(eachCar.id) && <>
                                            <button className='btn-primary btn' onClick={() => toggleAddressModal(eachCar.id)} >Buy Car</button>
                                        </>
                                        }
                                        {userDetails.role === "S" && eachCar.purchaseStatus !== "S" && <>
                                            <button className='btn-outline-danger btn mx-2 me-3' onClick={() => { handleEditClick(index) }}>Edit</button>
                                            <button className='btn-danger btn' onClick={() => { handleDeleteClick(eachCar.id) }}>Delete</button>
                                        </>}
                                    </td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>}
            {!isLoading && carsInfo.length <= 0 && <div className="d-flex align-items-center justify-content-center" style={{ height: '75vh' }}>
                <h3 className="no-data-box">No Vehicles Found</h3>
            </div>}
            {isLoading && <div className='align-items-center d-flex justify-content-center' style={{ "height": "75vh" }}><div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div></div>}
            {viewModal && <ViewModal show={viewModal} onHide={() => { setViewModal(!viewModal) }} selectedCar={selectedCar} />}
            {isEditModalOpen && <EditModal show={isEditModalOpen} onHide={() => { setEditModalOpen(!isEditModalOpen) }} carDetailInfo={editCarInfo} />}
            {addressModal && <AddressModal show={addressModal} onHide={() => { setAddressModal(!addressModal) }} setAddressId={(addressId) => { setAddressId(addressId) }} setOrderModal={setOrderModal} orderModal={orderModal} />}
            {orderModal && <OrderModal show={orderModal} onHide={() => { setOrderModal(!orderModal) }} carId={carId} addressId={addressId} request={request} setRequest={setRequest} />}
            {reasonModal && <ReasonModal show={reasonModal} onHide={() => { setReasonModal(!reasonModal) }} carId={carId} request={request} setRequest={setRequest} />}
            {approveModal && <ApproveModal show={approveModal} onHide={() => { setApproveModal(!approveModal) }} carId={carId}/>}
        </>
    )
}

export default DashBoard;
