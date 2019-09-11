var ERC721WithMetadata = artifacts.require("./ERC721WithMetadata.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721WithMetadata);
};