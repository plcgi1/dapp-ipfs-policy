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
    it('should get IPFS hashes after setting for accounts', async () => {
      const account = accounts[0]

      await contractInstance.mint(account, 1, ipfsHashes[0], baseUrl, { from: account })

      const result = await contractInstance.tokenMetadata(1)

      assert.equal(result.cid, ipfsHashes[0], 'CID 1 equal');
      assert.equal(result.url, baseUrl, 'baseUrl is equal')
    });
    it('should mint with account[0] if we call addMinter', async () => {
      const account = accounts[0]

      await contractInstance.mint(account, 1, ipfsHashes[0], baseUrl, { from: account })

      const result = await contractInstance.tokenMetadata(1)

      assert.equal(result.cid, ipfsHashes[0], 'CID 1 equal');
      assert.equal(result.url, baseUrl, 'baseUrl is equal')
    });
  })
});