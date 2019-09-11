pragma solidity >=0.5.0 <0.6.0;

import "./zeppelin/ERC20.sol";
import "./zeppelin/ERC20Mintable.sol";
import "./zeppelin/PayerRole.sol";

contract UtilityToken is ERC20, ERC20Mintable, PayerRole {
    mapping (address => bool) public users;
    
    constructor() public {
    }
    
    function mint(address account, uint256 amount) public onlyMinter returns (bool) {
        bool result = super.mint(account, amount);
        
        if (result)
            users[account] = true;
            
        return result;
    }
    
    function pay(address user, address recipient, uint256 amount) public onlyPayer returns (bool) {
        require(users[user]);
        
        _transfer(user, recipient, amount);
        
        return true;
    }
}

