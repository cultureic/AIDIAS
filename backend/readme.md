
# ZK Identity Verification API - Hackathon Documentation

## 📝 Overview

This API provides endpoints for generating and verifying zero-knowledge proofs for identity verification. It connects to a smart contract on zkSync Era mainnet to perform on-chain proof verification.

## 🚀 Quick Start

1. **Install dependencies**:
```bash
npm install express ethers snarkjs circomlibjs cors body-parser
```

2. **Run the server**:
```bash
node server.js
```

## 📂 File Structure

### `server.js`
The main API server file that handles proof generation and verification.

### `ZKcircom/` Directory
Contains all the circuit-related files needed for proof generation:

- `zk_identity_final.zkey` - The final zKey file for your circuit (proving key)  
- `verification_key.json` - The verification key for your circuit  
- `zk_identity_js/zk_identity.wasm` - The compiled circuit in WASM format  

## 🌐 API Endpoints

### 1. Generate Proof
- **Endpoint**: `POST /api/generate-proof`  
- **Purpose**: Generates a zk-SNARK proof for identity verification  
- **Input**: Optional custom input, otherwise generates mock data  
- **Response**: Returns proof, public signals, and input data

```bash
curl -X POST http://localhost:3000/api/generate-proof 
  -H "Content-Type: application/json" 
  -d '{}'
```

### 2. Verify Proof
- **Endpoint**: `POST /api/verify-proof`  
- **Purpose**: Verifies a proof on-chain using the smart contract  
- **Input**: Requires `proof` and `publicSignals` in request body  
- **Response**: Returns verification result (true/false)

```bash
curl -X POST http://localhost:3000/api/verify-proof 
  -H "Content-Type: application/json" 
  -d '{"proof": {...}, "publicSignals": [...]}'
```

### 3. Test Bad Proof (Verification Failure Case)
- **Endpoint**: `POST /api/test-bad-proof`  
- **Purpose**: Tests that the system correctly rejects invalid proofs  
- **Input**: None needed – generates and corrupts a proof automatically  
- **Response**: Confirms verification failed as expected

```bash
curl -X POST http://localhost:3000/api/test-bad-proof 
  -H "Content-Type: application/json" 
  -d '{}'
```

## 🔍 Testing Guide

### Testing Good Verification Flow (UI/UX)

1. **Generate a proof**:  
   - Call `/api/generate-proof` to create a valid proof  
   - Use the response in your frontend

2. **Verify the proof**:  
   - Send the proof to `/api/verify-proof`  
   - Should return:
```json
{
  "success": true,
  "verificationResult": true
}
```

### Testing Bad Proof Case

```bash
curl -X POST http://localhost:3000/api/test-bad-proof 
  -H "Content-Type: application/json" 
  -d '{}'
```

Expected response:
```json
{
  "success": true,
  "verificationResult": false,
  "message": "Bad proof correctly failed verification as expected"
}
```

## ⚙️ Configuration

Update these constants in `server.js` for your deployment:

```js
const CONTRACT_ADDRESS = "0xYourContractAddressHere";
const PRIVATE_KEY = "your_private_key_here"; // Replace before production
const NETWORK_RPC = "https://mainnet.era.zksync.io";
```

## 🛡️ Security Notes

1. **Private Key**: Never commit real private keys to code. Use environment variables or a secure vault in production.  
2. **Proof Verification**: The system includes a test endpoint to verify it correctly rejects invalid proofs.  
3. **Circuit Files**: All zk-SNARK circuit files should be generated securely in a trusted environment.  

## 🏆 Hackathon Considerations

This implementation demonstrates:  
- ✅ Zero-knowledge proof generation  
- ✅ On-chain verification via Solidity verifier contract  
- ✅ Proper error handling for invalid proofs  
- ✅ Mock data generation for easier testing  
- ✅ Clear API structure for frontend integration

The `/api/test-bad-proof` endpoint showcases how the system handles invalid proofs, which is essential for ensuring robust security and correctness.


# Groth16 Verifier Contract
``` // SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 20491192805390485299153009773594534940189261866228447918068658471970481763042;
    uint256 constant alphay  = 9383485363053290200918347156157836566562967994039712273449902621266178545958;
    uint256 constant betax1  = 4252822878758300859123897981450591353533073413197771768651442665752259397132;
    uint256 constant betax2  = 6375614351688725206403948262868962793625744043794305715222011528459656738731;
    uint256 constant betay1  = 21847035105528745403288232691147584728191162732299865338377159692350059136679;
    uint256 constant betay2  = 10505242626370262277552901082094356697409835680220590971873171140371331206856;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 12715476360760324599257743502763813776366025835200702040711798369187914889691;
    uint256 constant deltax2 = 21362340661413341007771859582376624598784681048707567288796529010959450018086;
    uint256 constant deltay1 = 8195432320461799677898552318002417158804838961127081904220677850366700967961;
    uint256 constant deltay2 = 4080989584755085012525129001547735938174876706136567850474826950306964529455;

    
    uint256 constant IC0x = 19214686637730247706820946726496713607273543010692718206675439857226967176081;
    uint256 constant IC0y = 6980301978761563851069977424576852642991668091012814932118033832813352744152;
    
    uint256 constant IC1x = 19564696456180708887608158635850331134478014358357537278587073988834670464006;
    uint256 constant IC1y = 1094900977679433907760077657960892989225531678104900738739498286804628741139;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[1] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
```

## Overview

The `Groth16Verifier` contract implements a Verifier for the Groth16 proof system, a widely used Zero-Knowledge Proof (ZKP) system. It enables the verification of cryptographic proofs that prove knowledge of certain information without revealing the actual data. This contract is part of a privacy-preserving protocol that ensures data integrity while keeping user information confidential.

This contract is designed to verify a proof generated by a Groth16 zk-SNARK (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) system.

## Contract Details

### Constants

The contract defines constants for:

- **Scalar Field (`r`)**: The size of the scalar field used in the elliptic curve.
- **Base Field (`q`)**: The size of the base field used in the elliptic curve.
- **Verification Key (`alphax`, `alphay`, `betax1`, `betax2`, etc.)**: The elements of the verification key required for proof verification.
- **Curve Points**: Predefined elliptic curve points `IC0x`, `IC0y`, `IC1x`, and `IC1y`, which are used in the verification process.

### Function: `verifyProof`

The primary function of the contract is `verifyProof`, which verifies the validity of a zk-SNARK proof.

#### Inputs:

- `_pA`: The first point of the proof.
- `_pB`: The second point of the proof (pairing value).
- `_pC`: The third point of the proof.
- `_pubSignals`: Public signals required for the proof verification.

#### Logic:

1. **Field Check**: The `checkField` function ensures that all values in the proof are valid elements of the field `r`. If any value does not satisfy the field conditions, the function returns `false`.
   
2. **Pairing Check**: The `checkPairing` function performs a pairing-based verification using the elliptic curve points (`alpha`, `beta`, `gamma`, `delta`) defined in the contract, and combines the public signal values with the verification key to check if the pairing equations hold.

3. **Memory Management**: Memory is allocated and cleared dynamically during the verification process to handle large data sets involved in zk-SNARK computations.

4. **Final Verification**: If the pairing check passes, the function returns `true`, indicating the proof is valid; otherwise, it returns `false`.

#### Pairing Computation

The pairing check is a critical part of the Groth16 proof verification process. It ensures that the proof satisfies specific elliptic curve pairing equations based on the public input signals and the predefined verification key.

- **Pairing Computations**: The pairing operation is done using elliptic curve arithmetic, leveraging predefined constants for curve points and using the G1 and G2 group operations.

### Security

The contract uses Solidity’s assembly to directly interact with the low-level operations for elliptic curve arithmetic. This ensures efficiency in the pairing operations, but also requires careful attention to avoid vulnerabilities in low-level coding.

### Usage

To use the contract, the user must provide the following inputs:

- The proof consisting of three points: `_pA`, `_pB`, and `_pC`.
- The public signals related to the proof: `_pubSignals`.

The user calls the `verifyProof` function, which returns a boolean value indicating whether the proof is valid.

## License

This contract is licensed under the **GNU General Public License v3.0** (GPL-3.0).

## Dependencies

The contract uses low-level cryptographic operations based on elliptic curve arithmetic and pairing-based verification systems. It is compatible with zk-SNARK proofs generated using the Groth16 setup, commonly used in privacy-preserving applications.

## Conclusion

The `Groth16Verifier` contract enables the verification of zero-knowledge proofs in a decentralized manner. By leveraging zk-SNARKs, it allows users to prove the validity of certain claims without revealing the underlying private data, which is crucial for maintaining privacy and security in blockchain applications.


