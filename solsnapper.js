import { clusterApiUrl } from "@solana/web3.js";
import commandLineArgs from "command-line-args";
import update from "./helper/update.js";
import convert from "./helper/convert.js";
import { colors } from "./helper/colors.js";

const mainDefinitions = [
  { name: "command", defaultOption: true },
  { name: "rpc", type: String, alias: "r" },
];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});

let rpc;
if (!mainOptions.rpc && mainOptions.command != "convert") {
  console.log(
    colors.yellow,
    "Using default RPC. Warning this may fail for larger mint lists. \n Use --rpc <NODE> to enter a private one!"
  );
  rpc = clusterApiUrl("mainnet-beta");
} else {
  rpc = mainOptions.rpc;
}

const argv = mainOptions._unknown || [];
switch (mainOptions.command) {
  case "update":
    console.log(colors.green, "Processing Update...");
    const updateDefinitions = [
      { name: "name", type: String, alias: "n" },
      { name: "mint", type: String, alias: "m" },
    ];
    const updateOptions = commandLineArgs(updateDefinitions, { argv });
    update({ rpc: rpc, updateOptions: updateOptions });
    break;

  case "convert":
    try {
      convert();
      console.log(colors.green, "Key converted! a key.json file was created");
    } catch (e) {
      console.log(colors.red, `Error converting Private Key: ${e}`);
    }
    break;

  default:
    console.log(colors.red, "Unkown Command");
    break;
}
