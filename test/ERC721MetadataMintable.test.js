const truffleAssert = require('truffle-assertions');

const ERC721MetadataMintable = artifacts.require('./ERC721MetadataMintable.sol');

let contractInstance;

let baseUrl = 'http://ipfs.server'

contract('ERC721MetadataMintable', (accounts) => {
  beforeEach(async () => {
    contractInstance = await ERC721MetadataMintable.new('name', 'symbol');
  });

  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH'
  ];

  describe('ERC721 with metadata on baseUrl, CID', () => {
    it('should exception thrown if addMinter from ERC contract address', async () => {
      try {
        await contractInstance.addMinter(accounts[1])

        const isMinter = await contractInstance.isMinter(accounts[1]);

        assert.equal(isMinter, false, 'Minter not added for contract');
      } catch (error) {
        assert.ok(
          /ERC721MetadataMintable\.addMinter/.test(error.message),
          'The contract is throwing which is the expected behaviour when you try to addMinter contractInstance'
        )
      }
    });
  })
});