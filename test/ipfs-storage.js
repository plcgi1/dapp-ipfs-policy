const { getBytes32FromMultiash, getMultihashFromContractResponse, getMultihashFromBytes32 } = require('../src/multihash');
const truffleAssert = require('truffle-assertions');

const ERC721WithMetadata = artifacts.require('./ERC721WithMetadata.sol');

contract('ERC721WithMetadata', (accounts) => {
  let ipfsStorage;

  beforeEach(async () => {
    ipfsStorage = await ERC721WithMetadata.new();
  });

  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH'
  ];

  async function setIPFSHash(account, hash) {
    const { digest, hashFunction, size } = getBytes32FromMultiash(hash);
    return ipfsStorage.addMetadata(digest, hashFunction, size, { from: account });
  }

  async function getIPFSHash(account, index) {
    const response = await ipfsStorage.getMetadata(account, index);

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
});