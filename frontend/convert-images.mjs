import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const dir = path.resolve("public/images");
const files = await fs.readdir(dir);

for (const file of files) {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

  const input = path.join(dir, file);
  const output = path.join(
    dir,
    file.replace(/\.(jpg|jpeg|png)$/i, ".webp")
  );

  await sharp(input)
    .webp({ quality: 82 })
    .toFile(output);

  console.log(`${file} -> ${path.basename(output)}`);
}