pragma solidity >=0.5.0 <0.6.0;

import "./Proxy.sol";

contract ProxyCreator {
    mapping(bytes32 => address) public proxies;
    
    function createProxy(bytes32 hash) public returns (address) {
        Proxy proxy = new Proxy();
        proxies[hash] = address(proxy);
    }
}

