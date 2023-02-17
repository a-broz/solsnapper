import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import commandLineArgs from "command-line-args";

const optionDefinitions = [{ name: "rpc", type: String, alias: "r" }];
const options = commandLineArgs(optionDefinitions);

if (
  Object.keys(options).length === 0 &&
  Object.getPrototypeOf(options) === Object.prototype
) {
  console.log("must set rpc parameter");
  process.exit();
}

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);
