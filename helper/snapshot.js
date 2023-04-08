import { colors } from "./colors.js";
import { getMints } from "./getMints.js";
import { getMetadata } from "./getMetadata.js";
import { getImages } from "./getImages.js";

export default async function snapshot({ rpc, snapshotOptions }) {
  if (!snapshotOptions.type) {
    console.log(
      colors.red,
      "Must include the type of snapshot to perform, i.e. snapshot mints"
    );
    return false;
  }
  if (snapshotOptions.type == "mints") {
    if (!snapshotOptions?.creator || !snapshotOptions?.owner) {
      console.log(colors.green, "Must include --creator or --owner");
      return false;
    }
    if (snapshotOptions?.creator && snapshotOptions?.owner) {
      console.log(colors.green, "Can only include either --creator or --owner");
      return false;
    }
    getMints(rpc, snapshotOptions);
  }

  if (snapshotOptions.type == "metadata") {
    console.log(rpc)
    getMetadata(rpc, snapshotOptions);
  }

  if (snapshotOptions.type == "images") {
    console.log(rpc)
    getImages(rpc, snapshotOptions);
  }

  return;
}
