import { PublicKey, Connection } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { colors } from "./colors.js";
import pLimit from "p-limit";
import got from "got";
import { promises as fs } from "fs";
import { readFileSync } from "fs";
import path from 'path';
import mime from 'mime-types';

export async function getImages(rpc, snapshotOptions) {
  const connection = new Connection(rpc, { httpAgent: false });
  const metaplex = new Metaplex(connection);

  if (!snapshotOptions?.mintList) {
    console.log(colors.red, `No mint list was provided`);
    return false;
  }

  const nftStrings = JSON.parse(readFileSync(snapshotOptions.mintList));
  let nftPKs = [];
  for (const nft of nftStrings) {
    try {
      nftPKs.push(new PublicKey(nft));
    } catch (e) {
      console.log(colors.red, `Invalid NFT address ${nft}`);
      return false;
    }
  }
  const limit = pLimit(30);
  const numNfts = nftPKs.length;
  let completedCount = 0;

  const promises = nftPKs.map((nft) => {
    return limit(async () => {
      const nftObj = await metaplex.nfts().findByMint({ mintAddress: nft });
      downloadImage(nftObj.json.image);
      completedCount++;
    });
  });

  Promise.all(promises)
    .then(() => {
      console.log(colors.green, "Completed!");
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

async function downloadImage(url) {
  const response = await got(url, { responseType: "buffer" });
  const contentType = response.headers['content-type'];
  const extension = mime.extension(contentType);
  const fileName = url.split("/").pop();
  const dir = "images";
  const filePath = `${dir}/${fileName}.${extension}`;
  try {
    await fs.access(dir);
    await fs.writeFile(filePath, response.body);
    console.log(`Downloaded ${fileName}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(dir);
      await fs.writeFile(filePath, response.body);
      console.log(`Downloaded ${fileName}`);
    } else {
      console.error(`Error writing file: ${err}`);
    }
  }
}
