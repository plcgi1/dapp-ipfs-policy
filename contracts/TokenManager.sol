pragma solidity ^0.5.8;

import "./ERC721MetadataMintable.sol";

contract TokenManager is Ownable {
    ERC721MetadataMintable managebleContract;
    address _address;

    constructor (address __address) public {
        managebleContract = ERC721MetadataMintable(__address);

        _address = __address;
    }

    function addMinter(address to) public {
        managebleContract.addMinter(to);
    }

    function getManagebleContract() public view returns (address contractAddress){
        return _address;
    }
}
