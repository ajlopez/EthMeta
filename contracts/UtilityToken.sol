pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract UtilityToken is ERC20 {
    mapping (address => bool) public users;
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) public {
    }
    
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
        users[account] = true;
    }
    
    function pay(address user, address recipient, uint256 amount) public returns (bool) {
        require(users[user]);
        
        _transfer(user, recipient, amount);
        
        return true;
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(!users[msg.sender]);
        return super.transfer(recipient, amount);
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        require(!users[msg.sender]);
        return super.approve(spender, amount);
    }    
}

