const { getBytes32FromMultiash, getMultihashFromContractResponse, getMultihashFromBytes32 } = require('../src/multihash');
const truffleAssert = require('truffle-assertions');

const ERC721WithMetadata = artifacts.require('./ERC721WithMetadata.sol');

let ERC721WithMetadataInstance;

contract('ERC721WithMetadata', (accounts) => {
  beforeEach(async () => {
    ERC721WithMetadataInstance = await ERC721WithMetadata.new();
  });

  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH'
  ];

  async function setIPFSHash(account, hash) {
    const { digest, hashFunction, size } = getBytes32FromMultiash(hash);
    return ERC721WithMetadataInstance.addMetadata(digest, hashFunction, size, { from: account });
  }

  async function getIPFSHash(account, index) {
    const response = await ERC721WithMetadataInstance.getMetadataByCursor(account, index);

    return getMultihashFromContractResponse(response);
  }

  async function getIPFSHashForCurrent(account) {
    const response = await ERC721WithMetadataInstance.getMetadata({ from: account });

    return getMultihashFromContractResponse(response);
  }
  it('should fire event when new has is set', async () => {
    const tx = await setIPFSHash(accounts[0], ipfsHashes[0]);

    truffleAssert.eventEmitted(tx, 'EntrySet', (ev) => {
      const hash = getMultihashFromBytes32(ev)

      return hash === ipfsHashes[0];
    });
  });

  it('should get IPFS hashes after setting for accounts', async () => {
    for (const account of accounts) {
      await setIPFSHash(account, ipfsHashes[0]);

      await setIPFSHash(account, ipfsHashes[1]);

      const hash1 = await getIPFSHash(account, 0)
      const hash2 = await getIPFSHash(account, 1)

      assert.equal(hash1, ipfsHashes[0], 'Hash 1 equal');
      assert.equal(hash2, ipfsHashes[1], 'Hash 2 equal');
    }
  });

  it('should get multihashes length', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);
    await setIPFSHash(accounts[0], ipfsHashes[1]);

    const count = await ERC721WithMetadataInstance.getLengthForCurrentAccount({ from: accounts[0] });
    const count0 = await ERC721WithMetadataInstance.getLengthForCurrentAccount({ from: accounts[1] });

    assert.equal(count.toNumber(), 2, 'Number of multihashes is 2 for accounts[0]')
    assert.equal(count0.toNumber(), 0, 'Number of multihashes is 0 for accounts[1]')
  });

  it('should get IPFS hashes after setting for accounts with invalid values', async () => {
    for (const account of accounts) {
      await setIPFSHash(account, ipfsHashes[0]);
      const hash = await getIPFSHashForCurrent(account);

      assert.equal(hash, ipfsHashes[0], 'Hash 1 equal');
    }
  });

  it('should get IPFS hashes after setting for accounts with invalid values', async () => {
    for (const account of accounts) {
      try {
        await setIPFSHash(account, ipfsHashes[0]);
        await getIPFSHash(account, 1)
      } catch (error) {
        assert.ok(
          /ERC721WithMetadata\.getMetadataByCursor\.Empty data/.test(error.message),
          'The contract is throwing which is the expected behaviour when you try to overflow'
        )
      }
    }
  });
});