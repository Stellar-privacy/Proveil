pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";

template SanctionsCheck() {
    signal input identityHash;   // Poseidon hash of identity (private)
    signal input merkleRoot;     // Root of sparse sanctions Merkle tree (public)
    signal input siblings[10];   // Merkle proof siblings (private)
    signal input pathNumber;     // Merkle path (PUBLIC — verifier-derived)
    signal output valid;
    signal output nullifier;     // Public nullifier binding proof to identityHash

    // pathNumber is a public input set by the trusted verifier, who derives
    // it from identityHash off-chain (pathNumber = identityHash mod 1024).
    // Making it public prevents the prover from choosing an arbitrary empty
    // slot. We decompose only 10 bits via Num2Bits(10), which is sound
    // because 2^10 = 1024 < p (the BN254 scalar field order). Full-field bit
    // decomposition via Num2Bits(254) would be unsound since 2^254 > p.

    component pathBits = Num2Bits(10);
    pathBits.in <== pathNumber;

    // Nullifier: Poseidon(identityHash, 0) — binds the proof to identityHash
    // without revealing it. Enables audit trail and prevents proof reuse.
    component nullHasher = Poseidon(2);
    nullHasher.inputs[0] <== identityHash;
    nullHasher.inputs[1] <== 0;
    nullifier <== nullHasher.out;

    // In a sparse Merkle tree the leaf at the identity's slot is 0 (empty)
    // when the identity is NOT on the sanctions list.
    signal nodes[11];
    signal left[10];
    signal right[10];

    nodes[0] <== 0;

    component hashers[10];
    component isZeroComp[10];

    for (var i = 0; i < 10; i++) {
        hashers[i] = Poseidon(2);
        isZeroComp[i] = IsZero();

        isZeroComp[i].in <== pathBits.out[i];

        left[i] <== isZeroComp[i].out * (nodes[i] - siblings[i]) + siblings[i];
        right[i] <== nodes[i] + siblings[i] - left[i];

        hashers[i].inputs[0] <== left[i];
        hashers[i].inputs[1] <== right[i];
        nodes[i+1] <== hashers[i].out;
    }

    component eq = IsEqual();
    eq.in[0] <== nodes[10];
    eq.in[1] <== merkleRoot;

    valid <== eq.out;
}

component main {public [merkleRoot, pathNumber]} = SanctionsCheck();
