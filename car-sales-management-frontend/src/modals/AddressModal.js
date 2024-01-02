import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddressService from "../services/AddressService";
import AddressCard from "./AddressCard";

const AddressModal = (props) => {
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [errors, setErrors] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(undefined);
    const addressService = AddressService();
    const [request, setRequest] = useState(false);
    const [address, setAddress] = useState({
        userId: userDetails.id,
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
    });

    useEffect(() => {
        if (userDetails.id != null) {
            getUserAddress();
        }
    }, [request]);

    const getUserAddress = () => {
        addressService.getUserAddress(userDetails.id).then((response) => {
            if (response.status === 200) {
                setAddressList(response.data);
                setSelectedAddress(response.data[0]);
            } else {
                setAddressList([]);
                setOpenModal(true);
            }
        }).catch((error) => {
            if (!error.response && error.message != null) {
                alert(error.message);
            } else if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
    }

    const handleAddressSelect = (selectedAddr) => {
        setSelectedAddress(selectedAddr);
    };

    const handleEditAddress = (selectedAddr) => {
        setAddress(selectedAddr);
        setOpenModal(true);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'zipcode' && !/^[0-9-]*$/.test(value)) {
            setErrors({
                ...errors,
                [id]: 'Zipcode can only contain numerics and hyphen (-).',
            });
            return;
        }
        setAddress({
            ...address,
            [id]: value,
        });
        setErrors({
            ...errors,
            [id]: '',
        });
    };

    const DeleteAddress = (addressId) => {
        addressService.deleteAddress(addressId).then((response) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!openModal) {
            saveAddress(selectedAddress);
            return;
        }
        const newErrors = {};
        if (!address.address1.trim()) {
            newErrors.address1 = 'Address 1 is required';
        }
        if (!address.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!address.state.trim()) {
            newErrors.state = 'State is required';
        }
        if (!address.zipcode.trim()) {
            newErrors.zipcode = 'Zipcode is required';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            saveAddress(address);
        }
    };

    const saveAddress = (addressToSave) => {
        addressService.saveAddress(addressToSave).then((response) => {
            if (response.status === 200) {
                props.setAddressId(response.data);
            }
            props.setOrderModal(!props.orderModal);
        }).catch((error) => {
            if (error.response && error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        props.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delivery Address
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(addressList.length > 0 && !openModal) &&
                    <AddressCard addressList={addressList} selectedAddress={selectedAddress} onSelectAddress={handleAddressSelect} onEditAddress={handleEditAddress} onDeleteAddress={DeleteAddress} />
                }
                {(addressList.length <= 0 || openModal) && (
                    <div>
                        <div>
                            <div>
                                <div class="form-floating mb-3 ">
                                    <input aria-label="input" type="text" id="address1" class="form-control" placeholder='H.no / Plot No' value={address.address1} onChange={handleChange} autoComplete="off" />
                                    <label for="address1">Adress line1*</label>
                                    {errors.address1 && <div className="d-flex text-danger">{errors.address1}</div>}
                                </div>
                                <div class="form-floating mb-3">
                                    <input aria-label="input" type="text" id="address2" class="form-control" placeholder='LandMark' value={address.address2} onChange={handleChange} autoComplete="off" />
                                    <label for="address2">Address line2</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input aria-label="text" type="text" id="city" class="form-control" placeholder='City' value={address.city} onChange={handleChange} autoComplete="off" />
                                    <label for="city">City*</label>
                                    {errors.city && <div className="d-flex text-danger">{errors.city}</div>}
                                </div>
                                <div class="form-floating mb-3">
                                    <input aria-label="text input" type="text" id="state" placeholder='State' class="form-control" value={address.state} onChange={handleChange} autoComplete="off" />
                                    <label for="state">State*</label>
                                    {errors.state && <div className="d-flex text-danger">{errors.state}</div>}
                                </div>
                                <div class="form-floating mb-3">
                                    <input aria-label="text input" type="text" id="zipcode" placeholder='Zipcode' class="form-control" value={address.zipcode} onChange={handleChange} autoComplete="off" maxLength={10} />
                                    <label for="zipcode">Zipcode*</label>
                                    {errors.zipcode && <div className="d-flex text-danger">{errors.zipcode}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                {addressList.length > 0 && <Button onClick={() => setOpenModal(!openModal)}> {`${openModal ? 'Show Addresses' : 'Add Address'}`}</Button>}
                <Button onClick={handleSubmit}>Save Address</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddressModal;
