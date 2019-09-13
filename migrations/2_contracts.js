var ERC721WithPolicy = artifacts.require("./ERC721WithPolicy.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721WithPolicy);
};