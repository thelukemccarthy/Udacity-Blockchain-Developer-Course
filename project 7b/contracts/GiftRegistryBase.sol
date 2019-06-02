pragma solidity >=0.4.21 <0.6.0;

import './GiftRegistryAccessControl.sol';

contract GiftRegistryBase is GiftRegistryAccessControl {
  uint256 public idCounter = 0;

  enum GiftStatus {
    Offered,    // 0
    Received,   // 1
    Accepted,   // 2
    Approved,   // 3
    Retained,   // 4
    Rejected,   // 5
    Returned    // 6
  }

  struct Gift {
    string description;
    uint256 value;
    GiftStatus status;
    address giftGiver;
    address giftReceiver;
    address giftApprover;
  }

  mapping(uint256 => Gift) public giftMap;

  function doesGiftExist(uint256 _giftId) internal view returns(bool){
    Gift memory gift = giftMap[_giftId];
    bytes memory giftAsBytes = bytes(gift.description);

    return giftAsBytes.length > 0;
  }

  function getGift(uint256 _giftId) public view returns(string memory, uint256, GiftStatus, address, address, address){
    require(doesGiftExist(_giftId), 'Gift not found');
    Gift memory gift = giftMap[_giftId];

    return (
      gift.description,
      gift.value,
      gift.status,
      gift.giftGiver,
      gift.giftReceiver,
      gift.giftApprover
    );
  }

  function isGiftReceived(GiftStatus _status) public pure returns(bool) {
    return _status == GiftStatus.Received;
  }

  function isGiftAccepted(GiftStatus _status) public pure returns(bool) {
    return _status == GiftStatus.Accepted;
  }

  function isGiftRejected(GiftStatus _status) public pure returns(bool) {
    return _status == GiftStatus.Rejected;
  }

  function isGiftApproved(GiftStatus _status) public pure returns(bool) {
    return _status == GiftStatus.Approved;
  }
}