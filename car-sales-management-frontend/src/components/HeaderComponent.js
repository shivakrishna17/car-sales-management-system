import React, { useEffect, useState } from 'react'
import CarLogo from '../images/carlogo.png';
import Dropdown from './Dropdown';
import Wallet from "../images/icons8-wallet-80.png"
import WalletDropdown from './WalletDropdown';
import AddBalanceModal from '../modals/AddBalanceModal';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
const HeaderComponent = (props) => {

  const [isWalletOpen, setWalletOpen] = useState(false);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
  const navigate = useNavigate()
  const userService = UserService();
  const [data, setData] = useState(false);

  useEffect(() => {
    if (userDetails == null || userDetails.id == null) {
      navigate("/");
      return;
    }
    getUserDetails();
  }, [data, props.request]);

  const getUserDetails = () => {
    userService.getUserDetails(userDetails.id, userDetails.role).then((response) => {
      if (response.status === 200) {
        localStorage.setItem("userDetails", JSON.stringify(response.data));
      }
    }).catch((error) => {
      if (error.response.status >= 400) {
        alert(error.response.data);
      }
    });
  }


  return (
    <React.Fragment>
      <div className='d-flex justify-content-between p-2 bg-info'>
        {userDetails.id && <button onClick={() => navigate("/dashboard")} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <img src={CarLogo} alt="Car Management" style={{ width: '50px', height: '50px' }} />
        </button>}
        <h2 className='mt-3 ms-5'>Car Sales Management</h2>
        <div className='d-flex'>
          <div className='d-flex me-3'>
            <img src={Wallet} alt='wallet' style={{ width: '66px', height: '70px' }} className='pt-2' />
            <WalletDropdown balanceUpdated={balanceUpdated} setWalletOpen={setWalletOpen} isWalletOpen={isWalletOpen} />
          </div>
          <div className='d-flex m-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24.001">
              <g id="profile_black_icon_24px" transform="translate(-180.258 -142.962)">
                <rect id="Rectangle_3294" data-name="Rectangle 3294" width="24" height="24" transform="translate(180.258 142.962)" fill="none" />
                <g id="Group_14561" data-name="Group 14561">
                  <g id="Group_14560" data-name="Group 14560">
                    <path id="Union_139" data-name="Union 139" d="M-4846.25-664.18a2.815,2.815,0,0,1-2.81-2.811,9.37,9.37,0,0,1,2.087-5.9,6.79,6.79,0,0,1,5.315-2.487,7.537,7.537,0,0,1,2.362.385,7.339,7.339,0,0,0,4.442,0h0a7,7,0,0,1,7.678,2.076,9.4,9.4,0,0,1,2.115,5.928,2.815,2.815,0,0,1-2.811,2.811Zm.414-7.82a7.942,7.942,0,0,0-1.776,5.009,1.38,1.38,0,0,0,1.362,1.362h18.38a1.367,1.367,0,0,0,1.362-1.334,7.935,7.935,0,0,0-1.774-5.009,5.556,5.556,0,0,0-6.108-1.645,8.781,8.781,0,0,1-5.334,0,5.458,5.458,0,0,0-1.9-.319A5.321,5.321,0,0,0-4845.835-672Zm2.414-9.817a6.369,6.369,0,0,1,6.362-6.363,6.369,6.369,0,0,1,6.362,6.363,6.369,6.369,0,0,1-6.362,6.361A6.369,6.369,0,0,1-4843.421-681.818Zm1.45,0a4.919,4.919,0,0,0,4.913,4.913,4.919,4.919,0,0,0,4.913-4.913,4.919,4.919,0,0,0-4.913-4.914A4.918,4.918,0,0,0-4841.972-681.818Z" transform="translate(5029.317 831.143)" fill="#080808" />
                  </g>
                </g>
              </g>
            </svg>
            <Dropdown />
          </div>
        </div>
      </div>
      {isWalletOpen && <AddBalanceModal setBalanceUpdated={setBalanceUpdated} show={isWalletOpen} onHide={() => { setWalletOpen(!isWalletOpen) }} availableBalance={userDetails.balance} reservedBalance={userDetails.reservedBalance} setData={setData} data={data} />}
    </React.Fragment>
  )
}

export default HeaderComponent