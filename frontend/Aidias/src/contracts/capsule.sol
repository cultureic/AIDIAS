// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Capsule {
    // State variables
    mapping(uint256 => string) private _contentHashes;
    uint256 private _tokenCounter;
    
    // Events
    event CapsuleCreated(uint256 indexed tokenId, string contentHash);
    
    // Main functions
    function createCapsule() external returns (uint256) {
        uint256 tokenId = _tokenCounter++;
        string memory hexId = _toHexString(tokenId);
        string memory randomHex = _generateRandomHex();
        
        _contentHashes[tokenId] = string(abi.encodePacked("0x", hexId, randomHex));
        
        emit CapsuleCreated(tokenId, _contentHashes[tokenId]);
        return tokenId;
    }
    
    function getContentHash(uint256 tokenId) external view returns (string memory) {
        return _contentHashes[tokenId];
    }
    
    // Helper functions
    function _generateRandomHex() private view returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory result = new bytes(64);
        
        for (uint256 i = 0; i < 64; i++) {
            result[i] = hexChars[uint256(keccak256(abi.encodePacked(block.timestamp, i))) % 16];
        }
        
        return string(result);
    }
    
    function _toHexString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        
        bytes memory hexChars = "0123456789abcdef";
        uint256 length = 0;
        uint256 temp = value;
        
        while (temp != 0) {
            length++;
            temp >>= 4;
        }
        
        bytes memory result = new bytes(length);
        
        while (value != 0) {
            result[--length] = hexChars[value & 0xf];
            value >>= 4;
        }
        
        return string(result);
    }
}