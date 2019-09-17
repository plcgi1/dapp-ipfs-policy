pragma solidity ^0.5.8;

import "./ERC721MetadataMintable.sol";

contract TokenManager {
    ERC721MetadataMintable managebleContract;
    address _address;

    constructor (address __address) public {
        managebleContract = ERC721MetadataMintable(__address);

        _address = __address;
        // TODO check me - why doesnot work
        // addMinter(address(this));
    }

    // TODO only owner
    function addMinter(address to) public {
        managebleContract.addMinter(to);
    }

    // for tests only
    function getManagebleContract() public view returns (address contractAddress){
        return _address;
    }
}
