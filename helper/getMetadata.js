import { PublicKey, Connection } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { colors } from "./colors.js";
import { writeFileSync, readFileSync } from "fs";
import pLimit from "p-limit";

export async function getMetadata(rpc, snapshotOptions) {
  const connection = new Connection(rpc, { httpAgent: false });
  const metaplex = new Metaplex(connection);

  if (!snapshotOptions?.list) {
    console.log(colors.red, `No mint list was provided for metadata snapshot`);
    return false;
  }

  const nftStrings = JSON.parse(readFileSync(snapshotOptions.list));
  let nftPKs = [];
  for (const nft of nftStrings) {
    try {
      nftPKs.push(new PublicKey(nft));
    } catch (e) {
      console.log(colors.red, `Invalid NFT address ${nft}`);
      return false;
    }
  }
  let metadata = [];
  const limit = pLimit(30);
  const numNfts = nftPKs.length;
  let completedCount = 0;

  const promises = nftPKs.map((nft) => {
    return limit(async () => {
      const nftObj = await metaplex.nfts().findByMint({ mintAddress: nft });
      metadata.push({ offChainMetadata: nftObj.json, mintAdress: nft, auth: nftObj.updateAuthorityAddress });
      completedCount++;
    });
  });

  Promise.all(promises)
    .then(() => {
      writeFileSync("metadataSnap.json", JSON.stringify(metadata));
    })
    .catch((error) => {
      console.log(`Error executing requests: ${error}`);
    });

  const interval = setInterval(() => {
    const completedPercentage = Math.floor((completedCount / numNfts) * 100);
    const status = `Processing ${completedPercentage}% [${"=".repeat(
      completedPercentage
    )}${" ".repeat(100 - completedPercentage)}]`;
    process.stdout.write(`${status}\r`);
    if (completedCount === numNfts) {
      clearInterval(interval);
      console.log();
    }
  }, 1000);
}
