import * as snarkjs from "snarkjs";

export async function generateAgeProof(birthdate: number, currentDate: number) {
  const input = { birthdate, currentDate };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "build/age_over_18_js/age_over_18.wasm",
    "build/circuit_final.zkey"
  );

  return { proof, publicSignals };
}
