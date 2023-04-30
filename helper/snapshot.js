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
