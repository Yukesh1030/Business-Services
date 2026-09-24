const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFiles = [
    "A focused first conversation-Contact-Page.jpg"
];

const assetsDir = path.join(__dirname, 'assets');

async function processImages() {
    for (const file of inputFiles) {
        const inputPath = path.join(assetsDir, file);
        const outputPath = path.join(assetsDir, file.replace('.jpg', '.webp'));

        if (fs.existsSync(inputPath)) {
            console.log(`Processing ${file}...`);
            try {
                await sharp(inputPath)
                    .resize({ width: 1200, withoutEnlargement: true }) 
                    .webp({ quality: 65 }) 
                    .toFile(outputPath);
                
                const stats = fs.statSync(outputPath);
                console.log(`Converted ${file} to WEBP. Size: ${(stats.size / 1024).toFixed(2)} KB`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        } else {
            console.log(`File not found: ${inputPath}`);
        }
    }
}

processImages();
