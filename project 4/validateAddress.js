const moment = require('moment');
const bitcoinMessage = require('bitcoinjs-message');

const starDB = require('./star_db');

const VALIDATION_WINDOW = 300;

const getExistingValidation = async (address) => {
  return await starDB.get(address);
}

const saveValidation = async (address, validationObj) => await starDB.add(address, validationObj);

const createValidationResponse = (address) => {
  const requestTimeStamp = moment().format('X');
  const message = address + ':' + requestTimeStamp + ':starRegistry';

  return {
    address,
    requestTimeStamp,
    message,
    validationWindow: VALIDATION_WINDOW
  };
};

const getValidationWindow = (responseObj) => {
  let validationWindow = responseObj.validationWindow;

  // can't use || here as 0 is falsey, causing the the second part of the || to execute
  // which causes an error because it doesn't exist
  if (validationWindow === undefined) {
    validationWindow = responseObj.status.validationWindow;
  }

  return validationWindow

};

const getAddress = (responseObj) => {
  return responseObj.address || responseObj.status.address;
};

const updateValidationResponse = (responseObj) => {
  updateValidationWindow(responseObj);
  const validationWindow = getValidationWindow(responseObj)

  if(validationWindow <= 0){
    const address = getAddress(responseObj);
    return createValidationResponse(address);
  }

  return responseObj;
};

const updateValidationWindow = (responseObj) => {
  const timeStamp = parseInt(responseObj.requestTimeStamp) || parseInt(responseObj.status.requestTimeStamp);
  const currentTime = moment().format('X');
  const validationWindow = timeStamp + VALIDATION_WINDOW - currentTime;

  if(responseObj.validationWindow) {
    responseObj.validationWindow = validationWindow;
  }else{
    responseObj.status.validationWindow = validationWindow;
  }
}

const updateRegisterStar = (validationObj) => {
  updateValidationWindow(validationObj);

  const validationWindow = validationObj && validationObj.status && validationObj.status.validationWindow || 0;
  const canRegisterStar = hasValidSignature(validationObj) && validationWindow > 0;

  if (validationObj && validationObj.registerStar != undefined){
    validationObj.registerStar = validationWindow && canRegisterStar
  }
};

const resetValidation = (responseObj) => {
  const address = getAddress(responseObj);
  const validationWindow = getValidationWindow(responseObj);

  if(validationWindow <= 0){
    return createValidationResponse(address);
  }

  return responseObj;
};

const createSignatureResponse = (address, signature, validationObj) => {
  updateValidationWindow(validationObj);

  const message = validationObj.message || validationObj.status.message || "";
  const validationWindow = validationObj.validationWindow || validationObj.status.validationWindow;
  const isValidSignature = bitcoinMessage.verify(message, address, signature);
  const canRegisterStar = isValidSignature && validationWindow > 0;

  return {
    registerStar: canRegisterStar,
    status: {
      address,
      requestTimeStamp: validationObj.requestTimeStamp || validationObj.status.requestTimeStamp,
      message: validationObj.message || validationObj.status.message,
      validationWindow,
      messageSignature: isValidSignature ? 'valid' : 'invalid'
    }
  }
}

const canRegisterStar = (validationObj) => {
  return validationObj && validationObj.registerStar === true;
};

const hasValidSignature = (validationObj) => {
  return validationObj && validationObj.status && validationObj.status.messageSignature === 'valid';
};

const isInsideValidationWindow = (validationObj) => {
  return validationObj && validationObj.status && validationObj.status.validationWindow > 0;
}

const isAddressVerified = (validationObj) => {
  if(Object.keys(validationObj).length == 0){
    // No validation object in the DB
    return false;
  }
  updateValidationWindow(validationObj);
  updateRegisterStar(validationObj);

  return canRegisterStar(validationObj) &&
    hasValidSignature(validationObj) &&
    isInsideValidationWindow(validationObj);

};

const removeValidation = async (address) => {
  await starDB.del(address);
};

module.exports = {
  getExistingValidation,
  saveValidation,
  createValidationResponse,
  updateValidationResponse,
  updateValidationWindow,
  createSignatureResponse,
  isAddressVerified,
  removeValidation,
};