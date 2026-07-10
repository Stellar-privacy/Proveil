#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Bytes, BytesN, Env, String, Vec,
    symbol_short,
};

// Public signals passed with proof
#[contracttype]
#[derive(Clone)]
pub struct PublicSignals {
    pub signals: Vec<String>,
}

// Verification result stored on-chain.
// wallet and proof_type are omitted — they are components of the storage key.
#[contracttype]
#[derive(Clone)]
pub struct VerificationRecord {
    pub verified: bool,
    pub timestamp: u64,
    pub public_signals_hash: BytesN<32>,
}

// Storage keys
#[contracttype]
pub enum DataKey {
    Record(Address, String),   // (wallet, proof_type) -> VerificationRecord
    Admin,
    Verifier,
    ProofCount,
}

#[contract]
pub struct ProVeilVerifier;

const VERIFICATION_TTL_SECONDS: u64 = 2592000; // 30 days

#[contractimpl]
impl ProVeilVerifier {

    /// Initialize contract with admin and trusted verifier address.
    ///
    /// The verifier is the only account authorized to attest ZK proof results.
    /// Full Groth16 verification is performed off-chain by the verifier; the
    /// contract stores the attested result and the real SHA-256 commitment of
    /// the public signals for audit purposes.
    ///
    /// Deploy atomically with `--init-function initialize` to prevent
    /// front-running of this call.
    pub fn initialize(env: Env, admin: Address, verifier: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Verifier, &verifier);
        env.storage().instance().set(&DataKey::ProofCount, &0u64);
        env.events().publish(
            (symbol_short!("init"),),
            (admin, verifier),
        );
    }

    /// Attest a ZK proof verification result on-chain.
    ///
    /// Only the trusted verifier address may call this. The verifier performs
    /// full snarkjs Groth16 verification off-chain and, upon success, calls this
    /// to record the result. The public signals are hashed with SHA-256 and
    /// stored as an immutable audit commitment.
    ///
    /// proof_type: "age_over_18" | "sanctions_check" | "accredited_investor"
    ///             | "credit_score_range" | "jurisdiction_check" | "source_of_funds"
    pub fn verify_proof(
        env: Env,
        verifier: Address,
        wallet: Address,
        proof_type: String,
        public_signals: PublicSignals,
    ) -> bool {
        verifier.require_auth();

        let stored_verifier: Address = env.storage().instance()
            .get(&DataKey::Verifier)
            .expect("not initialized");
        if verifier != stored_verifier {
            panic!("unauthorized verifier");
        }

        if public_signals.signals.is_empty() {
            panic!("invalid proof: no public signals");
        }

        if !Self::is_valid_proof_type(&proof_type) {
            panic!("unsupported proof type");
        }

        let signals_hash = Self::compute_signals_hash(&env, &public_signals);

        let record = VerificationRecord {
            verified: true,
            timestamp: env.ledger().timestamp(),
            public_signals_hash: signals_hash,
        };

        env.storage().persistent().set(
            &DataKey::Record(wallet.clone(), proof_type.clone()),
            &record,
        );

        let count: u64 = env.storage().instance()
            .get(&DataKey::ProofCount)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::ProofCount, &(count + 1));

        env.events().publish(
            (symbol_short!("verified"), proof_type),
            (wallet, true),
        );

        true
    }

    /// Check if a wallet has a valid (non-expired) verification for a proof type.
    /// Verifications expire after VERIFICATION_TTL_SECONDS to prevent stale
    /// results for time-sensitive checks (e.g. sanctions, credit score).
    pub fn is_verified(
        env: Env,
        wallet: Address,
        proof_type: String,
    ) -> bool {
        let key = DataKey::Record(wallet, proof_type);
        if let Some(record) = env.storage().persistent()
            .get::<DataKey, VerificationRecord>(&key)
        {
            let now = env.ledger().timestamp();
            let not_expired = now >= record.timestamp
                && now - record.timestamp <= VERIFICATION_TTL_SECONDS;
            record.verified && not_expired
        } else {
            false
        }
    }

    /// Get full verification record for a wallet
    pub fn get_record(
        env: Env,
        wallet: Address,
        proof_type: String,
    ) -> Option<VerificationRecord> {
        let key = DataKey::Record(wallet, proof_type);
        env.storage().persistent()
            .get::<DataKey, VerificationRecord>(&key)
    }

    /// Get total number of proofs verified
    pub fn proof_count(env: Env) -> u64 {
        env.storage().instance()
            .get(&DataKey::ProofCount)
            .unwrap_or(0)
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance()
            .get(&DataKey::Admin)
            .expect("not initialized")
    }

    /// Get trusted verifier address
    pub fn verifier(env: Env) -> Address {
        env.storage().instance()
            .get(&DataKey::Verifier)
            .expect("not initialized")
    }

    // Internal: validate proof type string via byte comparison (no String allocation)
    fn is_valid_proof_type(proof_type: &String) -> bool {
        let len = proof_type.len() as usize;
        if len > 32 {
            return false;
        }
        let mut buf = [0u8; 32];
        proof_type.copy_into_slice(&mut buf[..len]);
        let valid: [&[u8]; 6] = [
            b"age_over_18",
            b"sanctions_check",
            b"accredited_investor",
            b"credit_score_range",
            b"jurisdiction_check",
            b"source_of_funds",
        ];
        for t in valid.iter() {
            if &buf[..len] == *t {
                return true;
            }
        }
        false
    }

    // Internal: compute SHA-256 of concatenated public signals.
    // Uses a 128-byte buffer per signal — safely larger than the max BN254
    // field element decimal string (~77 chars).
    fn compute_signals_hash(env: &Env, signals: &PublicSignals) -> BytesN<32> {
        let mut combined = Bytes::new(env);
        for signal in signals.signals.iter() {
            let len = signal.len() as usize;
            if len > 128 {
                panic!("signal too long");
            }
            let mut buf = [0u8; 128];
            signal.copy_into_slice(&mut buf[..len]);
            combined.extend_from_slice(&buf[..len]);
        }
        env.crypto().sha256(&combined).to_bytes()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, vec, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register(ProVeilVerifier, ());
        let client = ProVeilVerifierClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        client.initialize(&admin, &verifier);
        assert_eq!(client.admin(), admin);
        assert_eq!(client.verifier(), verifier);
    }

    #[test]
    fn test_verify_age_proof() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(ProVeilVerifier, ());
        let client = ProVeilVerifierClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let user = Address::generate(&env);
        client.initialize(&admin, &verifier);

        let signals = PublicSignals {
            signals: vec![
                &env,
                String::from_str(&env, "1"),
                String::from_str(&env, "1700000000"),
            ],
        };

        let result = client.verify_proof(
            &verifier,
            &user,
            &String::from_str(&env, "age_over_18"),
            &signals,
        );

        assert!(result);
        assert!(client.is_verified(
            &user,
            &String::from_str(&env, "age_over_18"),
        ));
        assert_eq!(client.proof_count(), 1);

        let record = client.get_record(
            &user,
            &String::from_str(&env, "age_over_18"),
        );
        assert!(record.is_some());
        let record = record.unwrap();
        assert!(record.verified);

        let zero = BytesN::<32>::from_array(&env, &[0u8; 32]);
        assert_ne!(record.public_signals_hash, zero);
    }

    #[test]
    fn test_different_signals_produce_different_hashes() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(ProVeilVerifier, ());
        let client = ProVeilVerifierClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let user = Address::generate(&env);
        client.initialize(&admin, &verifier);

        let signals_a = PublicSignals {
            signals: vec![&env, String::from_str(&env, "1")],
        };
        client.verify_proof(
            &verifier,
            &user,
            &String::from_str(&env, "age_over_18"),
            &signals_a,
        );
        let hash_a = client.get_record(
            &user,
            &String::from_str(&env, "age_over_18"),
        ).unwrap().public_signals_hash;

        let user2 = Address::generate(&env);
        let signals_b = PublicSignals {
            signals: vec![&env, String::from_str(&env, "99999")],
        };
        client.verify_proof(
            &verifier,
            &user2,
            &String::from_str(&env, "age_over_18"),
            &signals_b,
        );
        let hash_b = client.get_record(
            &user2,
            &String::from_str(&env, "age_over_18"),
        ).unwrap().public_signals_hash;

        assert_ne!(hash_a, hash_b);
    }

    #[test]
    #[should_panic(expected = "unauthorized verifier")]
    fn test_unauthorized_verifier_rejected() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(ProVeilVerifier, ());
        let client = ProVeilVerifierClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let attacker = Address::generate(&env);
        let user = Address::generate(&env);
        client.initialize(&admin, &verifier);

        let signals = PublicSignals {
            signals: vec![&env, String::from_str(&env, "1")],
        };

        client.verify_proof(
            &attacker,
            &user,
            &String::from_str(&env, "age_over_18"),
            &signals,
        );
    }
}
