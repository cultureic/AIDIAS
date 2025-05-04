const express = require('express');
const { ethers } = require('ethers');
const snarkjs = require('snarkjs');
const { buildPoseidon } = require("circomlibjs");
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Configuration
const CONTRACT_ADDRESS = "0x4B93D458a243641327Bf5E3b94031170076Bc5eC";
const PRIVATE_KEY = "";
const NETWORK_RPC = "https://mainnet.era.zksync.io";

// Initialize Ethereum provider and signer
const provider = new ethers.JsonRpcProvider(NETWORK_RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Load contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256[2]","name": "_pA","type": "uint256[2]"},
      {"internalType": "uint256[2][2]","name": "_pB","type": "uint256[2][2]"},
      {"internalType": "uint256[2]","name": "_pC","type": "uint256[2]"},
      {"internalType": "uint256[1]","name": "_pubSignals","type": "uint256[1]"}
    ],
    "name": "verifyProof",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// Cache for circuit files
let zkey, verificationKey, wasm;

// Helper to load circuit files
async function loadCircuitFiles() {
  if (!zkey) {
    const zkeyPath = path.join(__dirname, 'ZKcircom', 'zk_identity_final.zkey');
    const zkeyBuffer = fs.readFileSync(zkeyPath);
    zkey = { type: "mem", data: new Uint8Array(zkeyBuffer) };
  }

  if (!verificationKey) {
    const vkeyPath = path.join(__dirname, 'ZKcircom', 'verification_key.json');
    verificationKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'));
  }

  if (!wasm) {
    const wasmPath = path.join(__dirname, 'ZKcircom', 'zk_identity_js', 'zk_identity.wasm');
    wasm = fs.readFileSync(wasmPath);
  }

  return { zkey, verificationKey, wasm };
}

// Generate mock input data
async function mockGenerateZkIdentityInput() {
  const poseidon = await buildPoseidon();
  const timestamp = Math.floor(Date.now() / 1000 / 3600) * 3600;
  const lat = Math.round((Math.random() * 180 - 90) * 10000);
  const lon = Math.round((Math.random() * 360 - 180) * 10000);
  const walletHash = BigInt('0x' + Array(16).fill(0)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')).toString();

  const hash = poseidon.F.toString(
    poseidon([BigInt(walletHash), BigInt(timestamp), BigInt(lat), BigInt(lon)])
  );

  return {
    commitment: hash,
    wallet: walletHash,
    timestamp: timestamp.toString(),
    lat: lat.toString(),
    lon: lon.toString()
  };
}

// API Endpoint to generate proof
app.post('/api/generate-proof', async (req, res) => {
  try {
    const { zkey, verificationKey, wasm } = await loadCircuitFiles();
    
    // Use provided input or generate mock data
    const proofInput = req.body.input || await mockGenerateZkIdentityInput();
    
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      proofInput,
      wasm, // No need to wrap in Uint8Array since we're using fs.readFileSync
      zkey
    );

    res.json({
      success: true,
      proof,
      publicSignals,
      input: proofInput
    });
  } catch (error) {
    console.error("Proof generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API Endpoint to verify proof on-chain
// API Endpoint to verify proof on-chain
app.post('/api/verify-proof', async (req, res) => {
    try {
        console.log("in here")
      const { proof, publicSignals } = req.body;
      
      if (!proof || !publicSignals) {
        throw new Error("Proof and publicSignals are required");
      }
  
      // Format proof for Solidity verifier
      const formattedProof = {
        a: [proof.pi_a[0], proof.pi_a[1]],
        b: [
          [proof.pi_b[0][1], proof.pi_b[0][0]], // Reverse for Solidity
          [proof.pi_b[1][1], proof.pi_b[1][0]]  // Reverse for Solidity
        ],
        c: [proof.pi_c[0], proof.pi_c[1]]
      };
  
      // Format public signals
      const formattedPublicSignals = publicSignals.map(signal =>
        ethers.toBigInt(signal).toString()
      );
  
      // Since this is a view function, it returns a boolean directly
      const isValid = await contract.verifyProof(
        formattedProof.a,
        formattedProof.b,
        formattedProof.c,
        formattedPublicSignals
      );
      console.log("isvalid",isValid)
      res.json({
        success: true,
        verificationResult: isValid
      });
  
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  // API Endpoint to test with a deliberately bad proof
app.post('/api/test-bad-proof', async (req, res) => {
    try {
      // First generate a valid proof to get the structure
      const { zkey, verificationKey, wasm } = await loadCircuitFiles();
      const proofInput = await mockGenerateZkIdentityInput();
      
      // Generate a valid proof first to get the structure
      const { proof: validProof, publicSignals: validPublicSignals } = await snarkjs.groth16.fullProve(
        proofInput,
        wasm,
        zkey
      );
  
      // Now create a bad proof by modifying the valid one
      const badProof = {
        pi_a: [...validProof.pi_a],
        pi_b: [...validProof.pi_b],
        pi_c: [...validProof.pi_c]
      };
  
      // Corrupt one of the proof components (here we modify pi_a[0])
      badProof.pi_a[0] = (BigInt(badProof.pi_a[0]) + BigInt(1)).toString();
  
      // Format the bad proof for Solidity verifier
      const formattedBadProof = {
        a: [badProof.pi_a[0], badProof.pi_a[1]],
        b: [
          [badProof.pi_b[0][1], badProof.pi_b[0][0]], // Reverse for Solidity
          [badProof.pi_b[1][1], badProof.pi_b[1][0]]  // Reverse for Solidity
        ],
        c: [badProof.pi_c[0], badProof.pi_c[1]]
      };
  
      // Format public signals (using the original ones)
      const formattedPublicSignals = validPublicSignals.map(signal =>
        ethers.toBigInt(signal).toString()
      );
  
      // Verify the bad proof on-chain
      const isValid = await contract.verifyProof(
        formattedBadProof.a,
        formattedBadProof.b,
        formattedBadProof.c,
        formattedPublicSignals
      );
  console.log("is valid",isValid)
      // We expect this to return false
      if (isValid) {
        throw new Error("Bad proof was incorrectly verified as valid!");
      }
  
      res.json({
        success: true,
        verificationResult: isValid,
        message: "Bad proof correctly failed verification as expected"
      });
  
    } catch (error) {
      console.error("Bad proof test error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ZK Proof API server running on port ${PORT}`);
});