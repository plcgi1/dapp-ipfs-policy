pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

/**
 * @title IPFSStorage
 * @author thx to Forest Fang (@saurfang)
 * @dev Stores IPFS (multihash) hash by address. A multihash entry is in the format
 * of <varint hash function code><varint digest size in bytes><hash function output>
 * See https://github.com/multiformats/multihash
 *
 * Currently IPFS hash is 34 bytes long with first two segments represented as a single byte (uint8)
 * The digest is 32 bytes long and can be stored using bytes32 efficiently.
 */
contract IPFSStorage is ERC721 {
    using Counters for Counters.Counter;

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    mapping (address => mapping (uint => Multihash)) private entries;
    mapping (address => Counters.Counter) private counters;

    function addMetadata(bytes32 _digest, uint8 _hashFunction, uint8 _size)
    public
    {
        Multihash memory entry = Multihash(_digest, _hashFunction, _size);

        counters[msg.sender].increment();

        entries[msg.sender][counters[msg.sender].current()] = entry;

        // get last index for msg.sender

//        uint currentIndex = indexes[msg.sender];
//        // increment last index
//        indexes[msg.sender] = currentIndex + 1;
//
//        // add to policies lastIndex => Multihash
//
//        // change entries =>
//        Multihash memory entry = Multihash(_digest, _hashFunction, _size);
//        entries[msg.sender] = entry;
//        EntrySet(
//            msg.sender,
//            _digest,
//            _hashFunction,
//            _size
//        );
    }

    function getMetadata(address _address, uint _cursor) public returns(bytes32 digest, uint8 hashfunction, uint8 size) {
        Multihash storage entry = entries[_address][_cursor];
        return (entry.digest, entry.hashFunction, entry.size);
    }
//    /**
//     * @dev deassociate any multihash entry with the sender address
//     */
//    function clearEntry()
//    public
//    {
//        require(entries[msg.sender].digest != 0);
//        delete entries[msg.sender];
//        EntryDeleted(msg.sender);
//    }
//
//    /**
//     * @dev retrieve multihash entry associated with an address
//     * @param _address address used as key
//     */
//    function getEntry(address _address)
//    public
//    view
//    returns(bytes32 digest, uint8 hashfunction, uint8 size)
//    {
//        Multihash storage entry = entries[_address];
//        return (entry.digest, entry.hashFunction, entry.size);
//    }
//
//    constructor () public {
//        cursor = 0;
//    }
}