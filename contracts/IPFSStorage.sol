pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

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
contract IPFSStorage is ERC721Mintable {
    uint lastIndex;

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
        uint8 index;
    }

    mapping (address => lastIndex) private indexes;
    mapping (address => Multihash) private entries;

    /**
     * @dev associate a multihash entry with the sender address
     * @param _digest hash digest produced by hashing content using hash function
     * @param _hashFunction hashFunction code for the hash function used
     * @param _size length of the digest
     */
    function addPolicy(bytes32 _digest, uint8 _hashFunction, uint8 _size)
    public
    {
        // get last index for msg.sender
        uint currentIndex = indexes[msg.sender];
        // increment last index
        indexes[msg.sender] = currentIndex + 1;

        // add to policies lastIndex => Multihash

        // change entries =>
        Multihash memory entry = Multihash(_digest, _hashFunction, _size);
        entries[msg.sender] = entry;
        EntrySet(
            msg.sender,
            _digest,
            _hashFunction,
            _size
        );
    }

    /**
     * @dev deassociate any multihash entry with the sender address
     */
    function clearEntry()
    public
    {
        require(entries[msg.sender].digest != 0);
        delete entries[msg.sender];
        EntryDeleted(msg.sender);
    }

    /**
     * @dev retrieve multihash entry associated with an address
     * @param _address address used as key
     */
    function getEntry(address _address)
    public
    view
    returns(bytes32 digest, uint8 hashfunction, uint8 size)
    {
        Multihash storage entry = entries[_address];
        return (entry.digest, entry.hashFunction, entry.size);
    }

    function IPFSStorage () {
        lastIndex = 0;
    }
}