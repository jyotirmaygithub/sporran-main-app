import * as Kilt from "@kiltprotocol/sdk-js";
import type {
    DidDocument,
    KiltAddress,
    MultibaseKeyPair,
    SignerInterface,
} from "@kiltprotocol/types";


export async function generateDid(
  keypair: MultibaseKeyPair,
  submitter: SignerInterface<"Ed25519", KiltAddress>
): Promise<{ didDocument: DidDocument; signers: SignerInterface[] }> {
  const api = Kilt.ConfigService.get("api");

  const txHandler = Kilt.DidHelpers.createDid({
    api,
    signers: [keypair],
    submitter,
    fromPublicKey: keypair.publicKeyMultibase,
  });
  console.log("txHandler created:", txHandler);

  const txResult = await txHandler.submit();
  console.log("Transaction result:", txResult);

  if (txResult.status !== "confirmed") {
    throw new Error(`❌ DID creation failed: ${txResult.status}`);
  }

  console.log(`✅ DID created: ${txResult.asConfirmed.didDocument.id}`);
  return {
    didDocument: txResult.asConfirmed.didDocument,
    signers: txResult.asConfirmed.signers,
  };
}
