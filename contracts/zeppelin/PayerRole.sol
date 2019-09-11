pragma solidity ^0.5.0;

import "./Roles.sol";

contract PayerRole {
    using Roles for Roles.Role;

    event PayerAdded(address indexed account);
    event PayerRemoved(address indexed account);

    Roles.Role private _payers;

    constructor () internal {
        _addPayer(msg.sender);
    }

    modifier onlyPayer() {
        require(isPayer(msg.sender), "PayerRole: caller does not have the Payer role");
        _;
    }

    function isPayer(address account) public view returns (bool) {
        return _payers.has(account);
    }

    function addPayer(address account) public onlyPayer {
        _addPayer(account);
    }

    function renouncePayer() public {
        _removePayer(msg.sender);
    }

    function _addPayer(address account) internal {
        _payers.add(account);
        emit PayerAdded(account);
    }

    function _removePayer(address account) internal {
        _payers.remove(account);
        emit PayerRemoved(account);
    }
}
