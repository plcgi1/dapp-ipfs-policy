const { getBytes32FromMultiash, getMultihashFromContractResponse, getMultihashFromBytes32 } = require('../src/multihash');
const truffleAssert = require('truffle-assertions');

const IPFSStorage = artifacts.require('./IPFSStorage.sol');

contract('IPFSStorage', (accounts) => {
  let ipfsStorage;

  beforeEach(async () => {
    ipfsStorage = await IPFSStorage.new();
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

  it('should get IPFS hash after setting', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);

    const hash = await getIPFSHash(accounts[0], 0)

    assert.equal(hash, ipfsHashes[0], 'Hashes equal');
  });
});