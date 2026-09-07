import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const sequences = [
  "public/images/burger-build",
  "public/images/burger-explosion",
];
const concurrency = 4;

async function convertFrame(directory, fileName) {
  const input = join(directory, fileName);
  const output = join(directory, `${parse(fileName).name}.webp`);
  const result = await sharp(input)
    .webp({ quality: 90, effort: 4, smartSubsample: true })
    .toFile(output);

  if (result.width !== 2560 || result.height !== 1440) {
    throw new Error(`${fileName} was resized to ${result.width}×${result.height}`);
  }
}

for (const directory of sequences) {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".png"));
  for (let index = 0; index < files.length; index += concurrency) {
    await Promise.all(files.slice(index, index + concurrency).map((file) => convertFrame(directory, file)));
  }
  console.log(`Converted ${files.length} frames in ${directory}`);
}
