pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";

template SourceOfFunds() {
    signal input transactionHistoryHash;   // Poseidon hash of tx history (private)
    signal input salt;                     // Random salt (private)
    signal input compliancePolicyHash;     // Public compliance policy hash
    signal output valid;
    signal output commitmentHash;          // Public commitment for audit trail

    // Compute commitment: Poseidon(transactionHistoryHash, salt)
    component hasher = Poseidon(2);
    hasher.inputs[0] <== transactionHistoryHash;
    hasher.inputs[1] <== salt;
    commitmentHash <== hasher.out;

    // Verify commitment matches policy
    component eq = IsEqual();
    eq.in[0] <== commitmentHash;
    eq.in[1] <== compliancePolicyHash;

    valid <== eq.out;
}

component main {public [compliancePolicyHash]} = SourceOfFunds();
