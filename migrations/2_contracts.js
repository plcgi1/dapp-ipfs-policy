var ERC721WithPolicy = artifacts.require("./ERC721WithPolicy.sol");
var ERC721MetadataMintable = artifacts.require("./ERC721MetadataMintable.sol");

module.exports = async (deployer) => {
  // experimental contract
  await deployer.deploy(ERC721WithPolicy, 'one', 'sym');

  const result = await deployer.deploy(ERC721MetadataMintable, 'name', 'sym');

  console.info('result, result')
};