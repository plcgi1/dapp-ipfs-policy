pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

/**
 * @title ERC721WithMetadata - save CID from IPFS storage to token contract
 * @author @plcgi1 inspired by Forest Fang (@saurfang)
 * @dev Stores IPFS (multihash) hash by address. A multihash entry is in the format
 * of <varint hash function code><varint digest size in bytes><hash function output>
 * See https://github.com/multiformats/multihash
 *
 * Currently IPFS hash is 34 bytes long with first two segments represented as a single byte (uint8)
 * The digest is 32 bytes long and can be stored using bytes32 efficiently.
 */
contract ERC721WithPolicy is ERC721Metadata, ERC721Mintable {
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

    constructor (string memory name, string memory symbol) public ERC721Metadata(name, symbol){
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
    * @dev associate a multihash entry with the sender address
    * @param _digest hash digest produced by hashing content using hash function
    * @param _hashFunction hashFunction code for the hash function used
    * @param _size length of the digest
    */
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

    /**
    * @dev retrieve multihash entry associated with an address
    * @param _address address used as key
    * @param _cursor cursor used as index
    */
    function getMetadataByCursor(address _address, uint _cursor)
    public
    view
    returns(bytes32 digest, uint8 hashfunction, uint8 size) {
        require(entries[_address][_cursor].digest != 0, "ERC721WithPolicy.getMetadataByCursor.Empty data, reverting");

        Multihash storage entry = entries[_address][_cursor];

        return (entry.digest, entry.hashFunction, entry.size);
    }

    /**
    * @dev retrieve last multihash entry associated with current address
    */
    function getMetadata()
    public
    view
    returns(bytes32 digest, uint8 hashfunction, uint8 size) {
        require(entries[msg.sender][counters[msg.sender].current() - 1].digest != 0, "ERC721WithPolicy.getMetadata.Empty data, reverting");

        Multihash storage entry = entries[msg.sender][counters[msg.sender].current() - 1];

        return (entry.digest, entry.hashFunction, entry.size);
    }

    /**
    * @dev retrieve entries length for current account
    */
    function getLengthForCurrentAccount()
    public
    view
    returns(uint256 _length) {
        return counters[msg.sender].current();
    }
}