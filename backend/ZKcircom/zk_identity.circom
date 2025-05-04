// zk_identity.circom
pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template ZkIdentity() {
    // Private inputs
    signal input wallet;       // hash of wallet address
    signal input timestamp;    // rounded timestamp
    signal input lat;          // rounded latitude  
    signal input lon;          // rounded longitude

    // Public input (the commitment we're verifying against)
    signal input commitment;

    component hasher = Poseidon(4);
    hasher.inputs[0] <== wallet;
    hasher.inputs[1] <== timestamp;
    hasher.inputs[2] <== lat;
    hasher.inputs[3] <== lon;

    // Verify computed hash matches the public commitment
    commitment === hasher.out;
}

// Main component with commitment as public input
component main {public [commitment]} = ZkIdentity();