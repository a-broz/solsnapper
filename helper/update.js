import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { colors } from "./colors.js";
import { writeFileSync, readFileSync } from "fs";
import pLimit from "p-limit";

export default async function update({ rpc, updateOptions }) {
  if (!updateOptions.mint && !updateOptions.list) {
    console.log(colors.red, "Must include --mint or --list when updating");
  }
  if (updateOptions.mint && updateOptions.list) {
    console.log(
      colors.red,
      "Cannot include both mint and mint list at the same time!"
    );
  }

  let mints;
  let logs = [];
  if (updateOptions.mint) {
    mints = [updateOptions.mint];
  } else {
    mints = JSON.parse(readFileSync(updateOptions.list));
  }

  //first check all valid nft addresses
  for (let mint of mints) {
    try {
      new PublicKey(mint);
    } catch (e) {
      console.error(e);
      console.log(colors.red, `Invalid mint address ${mint}`);
      return;
    }
  }
  if (updateOptions.collection) {
    try {
      new PublicKey(updateOptions.collection);
    } catch (e) {
      console.log(colors.red, "Invalid collection address");
      return;
    }
  }
  if (updateOptions.authority) {
    try {
      new PublicKey(updateOptions.authority);
    } catch (e) {
      console.log(colors.red, "Invalid update authority address");
      return;
    }
  }
  const limit = pLimit(30);
  const numNfts = mints.length;
  let completedCount = 0;
  const brokenMints = [];
  //second process updates against them.
  const promises = mints.map((mint) => {
    return limit(async () => {
      try {
        const connection = new Connection(rpc);
        const metaplex = new Metaplex(connection);
        const key = JSON.parse(readFileSync("key.json").toString()).slice(
          0,
          32
        );
        metaplex.use(keypairIdentity(Keypair.fromSeed(Uint8Array.from(key))));
        const nft = await metaplex.nfts().findByMint({
          mintAddress: new PublicKey(mint),
        });

        const nftFieldsToUpdate = {};

        if (updateOptions?.name) {
          if (nft.name === updateOptions.name) {
            console.log(
              colors.green,
              "No need to update name, already matches input on chain"
            );
            return;
          } else {
            nftFieldsToUpdate.name = updateOptions.name;
            console.log(
              colors.green,
              `Updating Name from: ${nft.name} to: ${updateOptions.name}`
            );
          }
        }
        if (updateOptions?.collection) {
          const collectionkey = new PublicKey(updateOptions.collection);
          if (nft?.collection?.address === collectionkey) {
            console.log(
              colors.green,
              `No need to update collection for ${mint}, already matches input on chain`
            );
            completedCount++;
            return;
          } else {
            nftFieldsToUpdate.collection = collectionkey;
            nftFieldsToUpdate.collectionIsSized = false;
            nftFieldsToUpdate.collectionAuthority = Keypair.fromSeed(
              Uint8Array.from(key)
            );
          }
        }
        if (updateOptions?.uri) {
          if (nft.uri === updateOptions.uri) {
            console.log(
              colors.green,
              `No need to update uri for ${mint}, already matches input on chain`
            );
            completedCount++;
            return;
          } else {
            nftFieldsToUpdate.uri = updateOptions?.uri;
          }
        }
        if (updateOptions?.authority) {
          if (
            nft.updateAuthorityAddress.toBase58() === updateOptions.authority
          ) {
            console.log(
              colors.green,
              `No need to update authority for ${mint}, already matches input on chain`
            );
            completedCount++;
            return;
          } else {
            nftFieldsToUpdate.newUpdateAuthority = new PublicKey(
              updateOptions?.authority
            );
          }
        }
        const resp = await metaplex.nfts().update({
          nftOrSft: nft,
          ...nftFieldsToUpdate,
        });
      } catch (e) {
        logs.push({ mintAddress: mint, error: e.message });
        brokenMints.push(mint);
      }

      completedCount++;
    });
  });

  Promise.all(promises)
    .then(() => {
      writeFileSync("update-cache.json", JSON.stringify(brokenMints));
      if (logs.length > 0) {
        writeFileSync("update-logs.json", JSON.stringify(logs));
      }
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

  return;
}
