const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.resolve(__dirname, '..', 'emporioAnimation');
const outputDir = path.resolve(__dirname, 'public', 'hero-frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processFrame(filename, index) {
  const inputPath = path.join(inputDir, filename);
  
  const meta = await sharp(inputPath).metadata();
  const w = meta.width;
  const h = meta.height;
  const scale = 1.5;
  const newWidth = Math.round(w * scale);
  const newHeight = Math.round(h * scale);
  
  // The star is in the bottom right corner.
  const starCenterX = Math.round(w * 0.898);
  const starCenterY = Math.round(h * 0.847);
  const patchSize = 70;
  
  // Extract a patch from just to the LEFT of the star on ORIGINAL image
  const sourceLeft = Math.max(0, starCenterX - patchSize - patchSize);
  const sourceTop = Math.max(0, starCenterY - Math.round(patchSize / 2));
  
  const originalPatchBuffer = await sharp(inputPath)
    .extract({
      left: sourceLeft,
      top: sourceTop,
      width: patchSize,
      height: patchSize
    })
    .toBuffer();

  // Scale the patch to match the upscaled image
  const scaledPatch = await sharp(originalPatchBuffer)
    .resize({ 
        width: Math.round(patchSize * scale), 
        height: Math.round(patchSize * scale), 
        kernel: sharp.kernel.lanczos3 
    })
    .toBuffer();

  const newStarCenterX = Math.round(starCenterX * scale);
  const newStarCenterY = Math.round(starCenterY * scale);
  const scaledPatchSize = Math.round(patchSize * scale);

  const paddedIndex = String(index + 1).padStart(3, '0');
  const outputPath = path.join(outputDir, `frame-${paddedIndex}.webp`);

  await sharp(inputPath)
    .resize({ 
        width: newWidth, 
        height: newHeight, 
        kernel: sharp.kernel.lanczos3,
    })
    .composite([{
      input: scaledPatch,
      left: newStarCenterX - Math.round(scaledPatchSize / 2),
      top: newStarCenterY - Math.round(scaledPatchSize / 2),
      blend: 'over'
    }])
    .sharpen({
        sigma: 1.2,
        m1: 1.5,
        m2: 0.8,
        x1: 2,
        y2: 10,
        y3: 20
    })
    .webp({ quality: 85 })
    .toFile(outputPath);
    
  console.log(`Upscaled and seamlessly patched ${filename} -> frame-${paddedIndex}.webp`);
}

async function main() {
  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.jpg'))
    .sort();
  
  console.log(`Processing ${files.length} frames...`);
  for (let i = 0; i < files.length; i++) {
    await processFrame(files[i], i);
  }
  console.log('Done!');
}

main().catch(console.error);
