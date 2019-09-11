pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

/**
 * @title ERC721WithMetadata - save CID from IPFS storage to token contract
 * @author thx to Forest Fang (@saurfang)
 * @dev Stores IPFS (multihash) hash by address. A multihash entry is in the format
 * of <varint hash function code><varint digest size in bytes><hash function output>
 * See https://github.com/multiformats/multihash
 *
 * Currently IPFS hash is 34 bytes long with first two segments represented as a single byte (uint8)
 * The digest is 32 bytes long and can be stored using bytes32 efficiently.
 */
contract ERC721WithMetadata is ERC721 {
    using Counters for Counters.Counter;

    event EntrySet (
        address indexed key,
        bytes32 digest,
        uint8 hashFunction,
        uint8 size,
        uint256 cursor
    );

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

        entries[msg.sender][counters[msg.sender].current()] = entry;

        counters[msg.sender].increment();

        emit EntrySet(
            msg.sender,
            _digest,
            _hashFunction,
            _size,
            counters[msg.sender].current()
        );
    }

    function getMetadata(address _address, uint _cursor)
    public
    view
    returns(bytes32 digest, uint8 hashfunction, uint8 size) {
        require(entries[_address][_cursor].digest != 0);

        Multihash storage entry = entries[_address][_cursor];

        return (entry.digest, entry.hashFunction, entry.size);
    }

    function getLengthForCurrentAccount()
    public
    view
    returns(uint256 _length) {
        return counters[msg.sender].current();
    }
}