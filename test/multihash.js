const { getBytes32FromMultiash, getMultihashFromBytes32 } = require('../src/multihash');

console.info('getMultihashFromBytes32', require('../src/multihash'))

describe('multihash', () => {
  it('should be able convert IPFS hash back and forth', async () => {
    const multihash = 'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8';
    
    assert.isTrue(multihash === getMultihashFromBytes32(getBytes32FromMultiash(multihash)));
  });
});