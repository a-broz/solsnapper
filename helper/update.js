import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { keypairIdentity, Metaplex, SelectedGuardGroupDoesNotExistError } from "@metaplex-foundation/js";
import { colors } from "./colors.js";
import { readFileSync } from "fs";

export default async function update({ rpc, updateOptions }) {
  if (!updateOptions.mint) {
    console.log(colors.red, "Must include --mint when updating");
  }
  let mint;
  try {
    mint = new PublicKey(updateOptions.mint);
  } catch (e) {
    console.log(colors.red, "Invalid mint address");
  }
  const connection = new Connection(rpc);
  const metaplex = new Metaplex(connection);
  const key = JSON.parse(readFileSync("key.json").toString()).slice(0,32);
  metaplex.use(keypairIdentity(Keypair.fromSeed(Uint8Array.from(key))));
  const nft = await metaplex.nfts().findByMint({
    mintAddress: mint,
  });

  if (nft.name === updateOptions.name){
    console.log(colors.red, "No need to update name, already matches input on chain")
    return;
  }

  console.log(
    colors.green,
    `Updating Name from: ${nft.name} to: ${updateOptions.name}`
  );

  const resp = await metaplex.nfts().update({
    nftOrSft: nft,
    name: updateOptions.name,
  });

  console.log(colors.green, resp);
  return;
}
