const starNotary = artifacts.require("./StarNotary.sol");

module.exports = function(deployer) {
  deployer.deploy(starNotary);
};