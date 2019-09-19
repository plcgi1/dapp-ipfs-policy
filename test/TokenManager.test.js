const truffleAssert = require('truffle-assertions');

const ERC721MetadataMintable = artifacts.require('./ERC721MetadataMintable.sol');
const TokenManager = artifacts.require('./TokenManager.sol');

let contractInstance;
let managerInstance;

contract('TokenManager', (accounts) => {
  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH'
  ];

  let baseUrl = 'http://ipfs.server'

  beforeEach(async () => {
    contractInstance = await ERC721MetadataMintable.new('name', 'symbol');
    managerInstance = await TokenManager.new(contractInstance.address);

    await contractInstance.setManagerAddress(managerInstance.address)
  });

  describe('Token manager', () => {
    it('should get manageable address', async () => {
      const result = await managerInstance.getManagebleContract()

      assert.equal(result, contractInstance.address, 'Manageable address set');
    });

    it('should manager address is minter', async () => {
      const isMinter = await contractInstance.isMinter(managerInstance.address)

      assert.equal(isMinter, true, 'Manageable address - minter');
    });

    it('should check accounts[1] - minter', async () => {
      const result = await managerInstance.addMinter(accounts[1])

      const isMinter = await contractInstance.isMinter(accounts[1]);

      assert.equal(isMinter, true, 'Minter added for contract');
    });

    it('restrict addMinter from contractInstance', async () => {
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
    it('restrict mint from contractInstance', async () => {
      try {
        await managerInstance.addMinter(accounts[1])

        await contractInstance.mint(accounts[1], 1, ipfsHashes[0], baseUrl, { from: accounts[1] })
      } catch (error) {
        assert.ok(
          /ERC721MetadataMintable\.mint/.test(error.message),
          'The contract is throwing which is the expected behaviour when you try to addMinter contractInstance'
        )
      }
    });
    it('should mint with account[0] if we call addMinter', async () => {
      const account = accounts[0]

      await managerInstance.mint(account, 1, ipfsHashes[0], baseUrl, { from: account })

      const result = await contractInstance.tokenMetadata(1)

      assert.equal(result.cid, ipfsHashes[0], 'CID 1 equal');
      assert.equal(result.url, baseUrl, 'baseUrl is equal')
    });
  })
});