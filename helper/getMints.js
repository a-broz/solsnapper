import { PublicKey, Connection } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { colors } from "./colors.js";
import { writeFileSync } from "fs";

export async function getMints(rpc, snapshotOptions) {
  const connection = new Connection(rpc, { httpAgent: false });
  const metaplex = new Metaplex(connection);
  if (!snapshotOptions?.creator && !snapshotOptions?.owner) {
    console.log(colors.green, "Must include --creator or --owner");
    return false;
  }
  if (snapshotOptions?.creator && snapshotOptions?.owner) {
    console.log(colors.green, "Can only include either --creator or --owner");
    return false;
  }
  if (snapshotOptions.creator) {
    console.log(
      colors.green,
      `Snapshotting mints by creator ${snapshotOptions.creator}\nNote: this can take a long time for larger collections.`
    );
    let creator;
    try {
      creator = new PublicKey(snapshotOptions.creator);
    } catch (e) {
      console.log(colors.red, "Invalid creator address");
      return;
    }
    await snapByCreator({ creator: creator, metaplex: metaplex });
  } else if (snapshotOptions.owner) {
    console.log(
      colors.green,
      `Snapshotting mints by owner ${snapshotOptions.owner}`
    );
    let owner;
    try {
      owner = new PublicKey(snapshotOptions.owner);
    } catch (e) {
      console.log(colors.red, "Invalid owner address");
      return;
    }
    await snapByOwner({ owner: owner, metaplex: metaplex });
  }

  return;
}

async function snapByOwner({ owner, metaplex }) {
  const nfts = await metaplex.nfts().findAllByOwner({ owner: owner });
  let mints = [];
  for (const nft of nfts) {
    mints.push(nft.mintAddress.toBase58());
  }
  writeFileSync("mintsByOwner.json", JSON.stringify(mints));
  return;
}

async function snapByCreator({ creator, metaplex }) {
  const nfts = await metaplex.nfts().findAllByCreator({ creator: creator });
  let mints = [];
  for (const nft of nfts) {
    mints.push(nft.mintAddress.toBase58());
  }
  writeFileSync("mintsByCreator.json", JSON.stringify(mints));
  return;
}
