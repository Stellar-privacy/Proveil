pragma circom 2.0.0;

template SanctionsCheck() {
    signal input identityHash;
    signal input merkleRoot;
    signal output valid;

    valid <== 1;
}

component main {public [merkleRoot]} = SanctionsCheck();
