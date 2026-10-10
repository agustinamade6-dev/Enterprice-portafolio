import sharp from "sharp";
import fs from "fs";
import path from "path";

async function createFavicons() {
  const rootDir = process.cwd();
  const iconPngPath = path.join(rootDir, "public", "logo-icon.png");
  const iconPngBuf = fs.readFileSync(iconPngPath);
  const base64 = iconPngBuf.toString("base64");

  // 1. icon.svg
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 242 240" width="242" height="240">
  <image href="data:image/png;base64,${base64}" width="242" height="240" />
</svg>
`;
  fs.writeFileSync(path.join(rootDir, "src", "app", "icon.svg"), svg);
  console.log("Updated src/app/icon.svg");

  // 2. icon.png in src/app (192x192)
  await sharp(iconPngPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(rootDir, "src", "app", "icon.png"));
  console.log("Created src/app/icon.png");

  // 3. apple-icon.png in src/app (180x180)
  await sharp(iconPngPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, "src", "app", "apple-icon.png"));
  console.log("Created src/app/apple-icon.png");

  // 4. public/favicon.ico
  await sharp(iconPngPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(rootDir, "public", "favicon.ico"));
  console.log("Created public/favicon.ico");
}

createFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
