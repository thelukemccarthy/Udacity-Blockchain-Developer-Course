pragma solidity >=0.4.21 <0.6.0;

contract GiftRegistryAccessControl {
  address private giftGiverAddress;
  address private GovernmentEmployeeAddress;
  address private ApprovingOfficerAddress;

  function setGiftGiver(address _giftGiver) public {
    giftGiverAddress = _giftGiver;
  }

  function getGiftGiver() public view returns(address) {
    return giftGiverAddress;
  }

  function setGovernmentEmployee(address _employee) public {
    GovernmentEmployeeAddress = _employee;
  }

  function getGovernmentEmployee() public view returns(address) {
    return GovernmentEmployeeAddress;
  }

  function setApprovingOfficer(address _approver) public {
    ApprovingOfficerAddress = _approver;
  }

  function getApprovingOfficer() public view returns(address) {
    return ApprovingOfficerAddress;
  }

  function addressesMatch(address _senderAddress, address _receiver) public pure returns(bool) {
    return _senderAddress == _receiver;
  }
}
