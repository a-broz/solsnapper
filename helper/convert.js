import bs58 from "bs58";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

export default function convert() {
  dotenv.config();
  const b = bs58.decode(process.env.PRIV_KEY);
  const j = new Uint8Array(
    b.buffer,
    b.byteOffset,
    b.byteLength / Uint8Array.BYTES_PER_ELEMENT
  );
  writeFileSync("key.json", `[${j}]`);
}
