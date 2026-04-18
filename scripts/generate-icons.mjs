// Génération des icônes PNG et splash screens à partir des sources SVG.
// Usage : node scripts/generate-icons.mjs

import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(__dirname, "assets");
const outDir = join(root, "public", "icons");
const splashDir = join(root, "public", "splash");

const COULEUR_FOND_SPLASH = "#0B0D1F";

async function pngDepuisSvg(svgPath, outPath, size) {
  const svg = await readFile(svgPath);
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`✓ ${outPath} (${size}×${size})`);
}

async function splashIOS(largeur, hauteur, iconSize, outPath) {
  const icon = await sharp(join(srcDir, "icon-any.svg"), { density: 384 })
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: largeur,
      height: hauteur,
      channels: 4,
      background: COULEUR_FOND_SPLASH,
    },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`✓ ${outPath} (${largeur}×${hauteur})`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(splashDir, { recursive: true });

  await pngDepuisSvg(join(srcDir, "icon-any.svg"), join(outDir, "icon-192.png"), 192);
  await pngDepuisSvg(join(srcDir, "icon-any.svg"), join(outDir, "icon-512.png"), 512);

  await pngDepuisSvg(join(srcDir, "icon-maskable.svg"), join(outDir, "icon-maskable-192.png"), 192);
  await pngDepuisSvg(join(srcDir, "icon-maskable.svg"), join(outDir, "icon-maskable-512.png"), 512);

  await pngDepuisSvg(join(srcDir, "icon-any.svg"), join(outDir, "apple-touch-icon.png"), 180);

  await pngDepuisSvg(join(srcDir, "icon-any.svg"), join(root, "public", "favicon-32.png"), 32);
  await pngDepuisSvg(join(srcDir, "icon-any.svg"), join(root, "public", "favicon-16.png"), 16);

  const splashs = [
    { largeur: 1290, hauteur: 2796, icon: 300, nom: "iphone-15-pro-max" },
    { largeur: 1179, hauteur: 2556, icon: 280, nom: "iphone-15-pro" },
    { largeur: 1170, hauteur: 2532, icon: 280, nom: "iphone-14" },
    { largeur: 1125, hauteur: 2436, icon: 270, nom: "iphone-x" },
    { largeur: 828, hauteur: 1792, icon: 220, nom: "iphone-11" },
    { largeur: 750, hauteur: 1334, icon: 200, nom: "iphone-8" },
  ];

  for (const s of splashs) {
    await splashIOS(s.largeur, s.hauteur, s.icon, join(splashDir, `${s.nom}.png`));
  }

  console.log("\n✦ Icônes et splashs générés avec succès.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
