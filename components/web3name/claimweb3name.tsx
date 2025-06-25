import * as Kilt from "@kiltprotocol/sdk-js";
import type {
    DidDocument,
    KiltAddress,
    SignerInterface
} from "@kiltprotocol/types";

export async function claimWeb3Name(
  name: string,
  didDocument: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<"Ed25519", KiltAddress>
): Promise<void> {
  const api = Kilt.ConfigService.get("api");

  const claimTx = api.tx.web3Names.claim(name);

  const txResult = await Kilt.DidHelpers.transact({
    api,
    call: claimTx,
    didDocument,
    signers: [...signers, submitter],
    submitter,
  }).submit();

  if (!txResult.asConfirmed) {
    throw new Error(`❌ Web3Name claim failed: ${txResult.status}`);
  }

  console.log(
    "✅ Web3Name claim confirmed:",
    txResult.asConfirmed.didDocument.alsoKnownAs
  );
}
