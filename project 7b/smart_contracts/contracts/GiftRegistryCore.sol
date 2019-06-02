pragma solidity >=0.4.21 <0.6.0;

import './GiftRegistryBase.sol';

contract GiftRegistryCore is GiftRegistryBase {

  function offerGift(string memory _description, uint256 _value, address _giftReceiver) public returns(uint256) {
    uint256 currentId = idCounter;
    giftMap[currentId] = Gift(_description, _value, GiftStatus.Offered, msg.sender, _giftReceiver, address(0));

    idCounter = idCounter + 1;

    return currentId;
  }

  function receiveGift(uint256 _giftId) public {
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(addressesMatch(msg.sender, gift.giftReceiver), 'Gift not received by address used');

    gift.status = GiftStatus.Received;
  }

  function acceptGift(uint256 _giftId, address _approver) public {
    require(_approver != address(0), 'An approvers\' address must be provided');
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(!addressesMatch(msg.sender, _approver), 'The approvers\' address can not be the same as the gift receiver\'s');
    require(addressesMatch(msg.sender, gift.giftReceiver), 'Gift not received by address used');
    require(isGiftReceived(gift.status), 'Gift not received yet, please receive this gift first');

    gift.status = GiftStatus.Accepted;
    gift.giftApprover = _approver;
  }

  function approveGift(uint256 _giftId) public {
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(addressesMatch(msg.sender, gift.giftApprover), 'You are not authorised to approve this gift');
    require(isGiftAccepted(gift.status), 'Gift not accepted yet, this gift can\'t be approved');

    gift.status = GiftStatus.Approved;
  }

  function rejectGift(uint256 _giftId) public {
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(addressesMatch(msg.sender, gift.giftApprover), 'You are not authorised to approve this gift');
    require(isGiftAccepted(gift.status), 'Gift not accepted yet, this gift can\'t be approved');

    gift.status = GiftStatus.Rejected;
  }

  function returnGift(uint256 _giftId) public {
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(addressesMatch(msg.sender, gift.giftReceiver), 'Only the address that received the gift can return it');
    require(
      isGiftReceived(gift.status) || isGiftRejected(gift.status),
      'Only gifts that have been received or rejected can be returned'
    );

    gift.status = GiftStatus.Returned;
  }

  function retainGift(uint256 _giftId) public {
    require(doesGiftExist(_giftId), 'Gift not found');

    Gift storage gift = giftMap[_giftId];

    require(addressesMatch(msg.sender, gift.giftReceiver), 'Only the address that received the gift can retain it');
    require(isGiftApproved(gift.status), 'Only gifts that have been approved can be retained');

    gift.status = GiftStatus.Retained;
  }
}