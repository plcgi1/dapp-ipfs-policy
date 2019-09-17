var ERC721WithPolicy = artifacts.require("./ERC721WithPolicy.sol");
var ERC721MetadataMintable = artifacts.require("./ERC721MetadataMintable.sol");
var TokenManager = artifacts.require("./TokenManager.sol");

module.exports = async (deployer) => {
  // experimental contract
  await deployer.deploy(ERC721WithPolicy, 'one', 'sym');

  const mintableInstance = await deployer.deploy(ERC721MetadataMintable, 'name', 'sym');

  const managerInstance = await deployer.deploy(TokenManager, mintableInstance.address);

  await mintableInstance.setManagerAddress(managerInstance.address)
};