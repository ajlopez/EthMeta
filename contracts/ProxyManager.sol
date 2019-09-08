pragma solidity >=0.5.0 <0.6.0;

import "./Proxy.sol";

contract ProxyManager {
    mapping(address => address) public proxies;
    
    function createProxy(address user) public returns (address) {
        require(proxies[user] == address(0));
        
        Proxy proxy = new Proxy(user);
        proxies[user] = address(proxy);
    }
}

