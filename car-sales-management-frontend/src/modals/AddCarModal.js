import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import VehicleService from '../services/VehicleService';

const AddCarModal = (props) => {

  const vehicleService = VehicleService();
  const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};

  const [carInfo, setCarInfo] = useState({
    "carMake": '',
    "carModel": '',
    "registrationNumber": '',
    "licensePlate": '',
    "yearOfManufacture": '',
    "carPrice": '',
    "mileage": ''
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const errorMessage = validateFields(event);
    if (errorMessage) {
      setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
    } else {
      setErrors({ ...errors, [id]: '' });
    }
    setCarInfo((prevCarInfo) => ({
      ...prevCarInfo,
      [id]: id === 'yearOfManufacture' ? value.replace(/\D/g, '').slice(0, 4) : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImageFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyFields = Object.values(carInfo).some(value => value === '');
    if (hasEmptyFields) {
      alert("All fields are required. Please fill in all the fields.");
      return;
    }
    const formData = new FormData();
    formData.append('vehicle', JSON.stringify(carInfo));
    formData.append('image', imageFile);
    props.setIsLoading(!props.isLoading);
    vehicleService.addVehicle(formData, userDetails.id).then((response) => {
      if (response.status === 200) {
        alert(response.data);
        window.location.reload();
      }
    }).catch((error) => {
      if (error.response.status >= 400) {
        alert(error.response.data);
      }
    });
    props.onHide();
  }

  const validateFields = (e) => {
    setErrors({});
    if (e.target.id.indexOf('carMake') > -1 && !e.target.value) {
      return "Car nake is mandatory";
    }
    if (e.target.id.indexOf('carModel') > -1 && !e.target.value) {
      return "Car model is mandatory";
    }
    if (e.target.id.indexOf('registrationNumber') > -1 && !e.target.value) {
      return "Registration number is mandatory";
    }
    if (e.target.id.indexOf('licensePlate') > -1 && !e.target.value) {
      return "License Plate is mandatory";
    }
    if (e.target.id.indexOf('yearOfManufacture') > -1 ) {
      if(!e.target.value) {
        return "year of manufacture is mandatory";
      }
    }
    if (e.target.id.indexOf('carPrice') > -1) {
      if (!e.target.value) {
        return "Car price is mandatory";
      }
      if (e.target.value > 80000) {
        return "Car price cannot exceed $80000";
      }
    }
    if (e.target.id.indexOf('mileage') > -1 && !e.target.value) {
      return "mileage is mandatory";
    }

  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Car Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <div>
              <div class="form-floating mb-3">
                <input aria-label="input" type="text" id="carMake" class="form-control" placeholder='Car Name' value={carInfo.carMake} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="carMake">Car Make</label>
                {errors.carMake && <div className="text-danger " style={{ fontSize: '12px' }}>{errors.carMake}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="input" type="text" id="carModel" class="form-control" placeholder='Car Model' value={carInfo.carModel} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="carModel">Car Model</label>
                {errors.carModel && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.carModel}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="text" type="text" id="registrationNumber" class="form-control" placeholder='Registration Number' value={carInfo.registrationNumber} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="registrationNumber">Registration Number</label>
                {errors.registrationNumber && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.registrationNumber}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="text" type="text" id="licensePlate" class="form-control" placeholder='License Plate' value={carInfo.licensePlate} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="licensePlate">License Plate</label>
                {errors.licensePlate && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.licensePlate}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="text input" type="text" id="yearOfManufacture" placeholder='Year Of Manufacture' class="form-control" value={carInfo.yearOfManufacture} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="yearOfManufacture">Year Of Manufacture</label>
                {errors.yearOfManufacture && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.yearOfManufacture}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="text input" type="text" id="carPrice" placeholder='Car Price' class="form-control" value={carInfo.carPrice} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="carPrice">Car Price</label>
                {errors.carPrice && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.carPrice}</div>}
              </div>
              <div class="form-floating mb-3">
                <input aria-label="text input" type="number" id="mileage" placeholder='Mileage' class="form-control" value={carInfo.mileage} onChange={handleInputChange} autoComplete='off' onBlur={handleInputChange}/>
                <label for="mileage">Mileage</label>
                {errors.mileage && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.mileage}</div>}
              </div>
              <div class="form-floating mb-3">
                <span className='me-3'>Car Image</span><input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Add Car</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddCarModal