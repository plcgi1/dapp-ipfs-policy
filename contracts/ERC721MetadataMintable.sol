pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title
 * @author
 *
 */
contract ERC721MetadataMintable is ERC721Metadata, MinterRole, Ownable {
    string _baseUri;
    address _managerAddress;

    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    constructor (string memory _name, string memory _symbol) public ERC721Metadata(_name, _symbol){
        // solhint-disable-previous-line no-empty-blocks
    }

    function addMinter (address _address) public {
        require(
            msg.sender == _managerAddress,
            'ERC721MetadataMintable.addMinter.Address from must be from manager contract only'
        );
        super.addMinter(_address);
    }
    /**
     * @dev Function to mint tokens.
     * @param to The address that will receive the minted tokens.
     * @param tokenId The token id to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address to, uint256 tokenId, string memory cid, string memory baseUri) public onlyMinter returns (bool) {
        _tokenURIs[tokenId] = cid;
        _baseUri = baseUri;

        _mint(to, tokenId);

        return true;
    }

    /**
     * @dev Get metadata string parts.
     * @param _tokenId The token id to mint.
     * @return base uri for metadata where placed metadata file
     * @return CID for metadata where placed metadata file (IPFS cid)
     */
    function tokenMetadata(uint256 _tokenId)
    public
    view
    returns(string memory url, string memory cid)
    {
        return (_baseUri, _tokenURIs[_tokenId]);
    }

    function setManagerAddress(address _address) public onlyMinter {
        _managerAddress = _address;
        // add management contract address to minters
        super.addMinter(_address);
    }

    function getManagerAddress() public view onlyOwner returns (address _address){
        return _managerAddress;
    }
}
