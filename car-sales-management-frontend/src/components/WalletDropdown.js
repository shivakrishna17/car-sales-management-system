import React, { useState } from "react";
import './../css/Dropdown.css';

const WalletDropdown = (props) => {

    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(props.isWalletOpen);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleBalance = () => {
        props.setWalletOpen(!props.isWalletOpen);
    };

    return (
        <div className="dropdown-container" onClick={toggleDropdown}>
            <div className="profile">
                <p className='mb-1 fs-12'>Available cash</p>
                <p className='text-danger mb-1'>$ {(userDetails.balance)?.toFixed(2)}</p>
            </div>
            {isDropdownOpen && (
                <div className="dropdown-content">
                    <div className="border-bottom ">
                        Balance : {(userDetails.balance).toFixed(2)}
                    </div>
                    <div className="profile" onClick={handleBalance}>
                        Add Balance
                    </div>
                </div>
            )}
        </div>
    );
}

export default WalletDropdown;