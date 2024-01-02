import React from "react";

const AddressCard = (props) => {
  const { addressList, selectedAddress, onSelectAddress, onEditAddress, onDeleteAddress } = props;

  return (
    <div className="row g-3 flex-wrap">
      {addressList.map((eachAddr) => (
        <div className="card mb-2 me-3" key={eachAddr.address1} style={{ width: "calc(33.33% - 1rem)" }}>
          <div className="align-items-baseline d-flex">
            <input type="radio" id={eachAddr.address1} name="address" value={eachAddr.address1} style={{ width: "20px" }} className="mt-3 profile" checked={selectedAddress && selectedAddress.id === eachAddr.id} onChange={() => onSelectAddress(eachAddr)} />
            <div>
              <p className="mb-0 fw-bold">{eachAddr.address1}</p>
              <span className="text-capitalize mb-3 text-secondary" style={{ overflowWrap: "break-word", fontSize: "12px" }}>
                {`${eachAddr.city}, ${eachAddr.state}, ${eachAddr.zipcode}`}
              </span>
            </div>
          </div>
          <div className="mt-2 mb-2">
            <button className="btn btn-primary ms-2" onClick={() => onEditAddress(eachAddr)}>
              Edit
            </button>
            <button className="btn btn-danger ms-2" onClick={() => onDeleteAddress(eachAddr.id)}>
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AddressCard;
