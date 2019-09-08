pragma solidity >=0.5.0 <0.6.0;

import "./ECDSA.sol";

contract Proxy {
    address public user;
    uint public nonce;
    
    constructor(address _user) public {
        user = _user;
    }
    
    function forward(bytes memory signature, address to, uint value, bytes memory data) public {
        bytes32 hash = getMessageHash(to, value, data);
        
        require(user == getSender(hash, signature));
        
        nonce++;
        
        assembly {
            pop(call(gas, to, value, add(data, 0x20), mload(data), 0, 0))
        }
    }
    
    function getMessageHash(address to, uint value, bytes memory data) public view returns (bytes32) {
        return ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(user, to, value, data, nonce)));
    }
    
    function getSender(bytes32 hash, bytes memory signature) public pure returns (address) {
        return ECDSA.recover(hash, signature);
    }
}


