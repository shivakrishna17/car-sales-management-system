import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import HeaderComponent from './HeaderComponent';
import SelectedUserModal from "../modals/SelectedUserModal";
import { getSellerStatus } from "../Helper/Helper";


const SellerRequest = () => {

    const userService = UserService();
    const [sellerRequests, setSellerRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [viewModal, setViewModal] = useState(false);
    const [request, setRequest] = useState(false);

    useEffect(() => {
        getSellerRequests();
    }, [request]);

    const getSellerRequests = () => {
        setIsLoading(true);
        userService.getSellerRequests().then((response) => {
            if (response.status === 200) {
                setSellerRequests(response.data);
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

    const handleView = (index) => {
        setViewModal(!viewModal);
        setSelectedUser(sellerRequests[index]);
    }

    const handleApprove = (userId) => {
        userService.approveUser(userId).then((response) => {
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
    }

    const handleReject = (userId) => {
        userService.rejectUser(userId).then((response) => {
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
    }

    return (
        <>
            <HeaderComponent />
            {sellerRequests.length > 0 && <>
                <h3 className="d-flex justify-content-center mt-3">Seller Requests</h3>
                <table class="table table-bordered container mt-4">
                    <thead>
                        <tr>
                            <th scope="col">Seller Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Location</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerRequests.length > 0 && sellerRequests.map((eachRequest, index) => {
                            return (
                                <>
                                    <tr>
                                        <td>{eachRequest.name}</td>
                                        <td>{eachRequest.email}</td>
                                        <td>{eachRequest.phonenumber}</td>
                                        <td>{eachRequest.location}</td>
                                        <td>{getSellerStatus(eachRequest.status)}</td>
                                        <td>
                                            <button className='btn-primary btn me-2' onClick={() => handleView(index)}>View</button>
                                            {eachRequest.status === "P" && <>
                                                <button className='btn-success btn me-2' onClick={() => handleApprove(eachRequest.id)}>Approve</button>
                                                <button className='btn-danger btn' onClick={() => handleReject(eachRequest.id)}>Reject</button>
                                            </>}
                                        </td>
                                    </tr>
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </>}
            {!isLoading && sellerRequests.length <= 0 && <div className="d-flex align-items-center justify-content-center" style={{ height: '75vh' }}>
                <h3 className="no-data-box">No Seller Requests Found</h3>
            </div>}
            {viewModal && <SelectedUserModal show={viewModal} onHide={() => { setViewModal(!viewModal) }} selectedUser={selectedUser} />}
        </>
    )
}

export default SellerRequest;