const bs58 = require('bs58');

/**
 * @typedef {Object} Multihash
 * @property {string} digest The digest output of hash function in hex with prepended '0x'
 * @property {number} hashFunction The hash function code for the function used
 * @property {number} size The length of digest
 */

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
const getBytes32FromMultiash = (multihash) => {
  const decoded = bs58.decode(multihash);
  
  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
}
exports.getBytes32FromMultiash = getBytes32FromMultiash

/**
 * Encode a multihash structure into base58 encoded multihash string
 *
 * @param {Multihash} multihash
 * @returns {(string|null)} base58 encoded multihash string
 */
const getMultihashFromBytes32 = (multihash) => {
  const { digest, hashFunction, size } = multihash;
  if (size === 0) return null;
  
  // cut off leading "0x"
  const hashBytes = Buffer.from(digest.slice(2), 'hex');
  
  // prepend hashFunction and digest size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);
  
  return bs58.encode(multihashBytes);
}
exports.getMultihashFromBytes32 = getMultihashFromBytes32
/**
 * Parse Solidity response in array to a Multihash object
 *
 * @param {array} response Response array from Solidity
 * @returns {Multihash} multihash object
 */
const parseContractResponse = (response) => {
  return {
    digest: response[0],
    hashFunction: response[1].toNumber(),
    size: response[2].toNumber(),
  };
}

/**
 * Parse Solidity response in array to a base58 encoded multihash string
 *
 * @param {array} response Response array from Solidity
 * @returns {string} base58 encoded multihash string
 */
const getMultihashFromContractResponse = (response) => {
  return getMultihashFromBytes32(parseContractResponse(response));
}
exports.getMultihashFromContractResponse = getMultihashFromContractResponse
