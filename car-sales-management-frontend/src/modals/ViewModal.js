import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const ViewModal = (props) => {

  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);
  const carDetails = props.selectedCar;
  const port = "http://localhost:8080";
  const lightboxImage = port + carDetails.image;

  const handleImageClick = () => {
    setImageLightboxOpen(true);
  }

  const handleLightboxClose = () => {
    setImageLightboxOpen(false);
  }

  return (
    <>
      {!imageLightboxOpen && <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Car Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-4'>
              <img src={port + carDetails.image} alt="Car Img" height="90px" className='rounded-3 profile' onClick={() => { handleImageClick() }} />
            </div>
            <div className='col'>
              <div className='d-flex flex-wrap'>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="carMake" class="form-control-plaintext" value={carDetails.carMake} /><label for="CarName">Car Make</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="carModel" class="form-control-plaintext" value={carDetails.carModel} /><label for="carName">Car Model</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="registrationNumber" class="form-control-plaintext" value={carDetails.registrationNumber} /><label for="registrationNumber">Registration Number</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="yearOfManufacture" class="form-control-plaintext" value={carDetails.yearOfManufacture} /><label for="YearOfManufacture">Year Of Manufacture</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="carPrice" class="form-control-plaintext" value={carDetails.carPrice} /><label for="carPrice">Car Price</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="mileage" class="form-control-plaintext" value={carDetails.mileage} /><label for="mileage">Mileage (Km/Lit)</label>
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="licensePlate" class="form-control-plaintext" value={carDetails.licensePlate} /><label for="licensePlate">License Plate</label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>}
      {imageLightboxOpen && <Lightbox mainSrc={lightboxImage} onCloseRequest={handleLightboxClose} />}
    </>
  )
}

export default ViewModal