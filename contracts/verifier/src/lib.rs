#![no_std]
use soroban_sdk::{contract, contractimpl, Bytes, Env};

#[contract]
pub struct VerifierContract;

#[contractimpl]
impl VerifierContract {
    pub fn verify_proof(env: Env, proof: Bytes, public_inputs: Bytes, verification_key: Bytes) -> bool {
        env.crypto().bn254_verify(&proof, &public_inputs, &verification_key)
    }
}
