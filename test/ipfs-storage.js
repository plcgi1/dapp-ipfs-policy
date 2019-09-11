const { getBytes32FromMultiash, getMultihashFromContractResponse } = require('../src/multihash');

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

  async function getIPFSHash(account) {
    const response = await ipfsStorage.getMetadata(account, 0);

    return getMultihashFromContractResponse(response);
  }

  it('should get IPFS hash after setting', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);
    const hash = await getIPFSHash(accounts[0])
    // assert(await getIPFSHash(accounts[0])).to.equal(ipfsHashes[0]);
    console.info(hash)
  });
});