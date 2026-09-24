const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFiles = [
    "Cover-Image-About-Page.jpg",
    "Evelyn Zoldyck-CPO-About-Page.jpg",
    "Jennifer Luana-People Management-About-Page.jpg",
    "Juan Tiago-Head of Engineer-About-Page.jpg",
    "Maura Yalah-Product Design-About-Page.jpg",
    "Reddington M-Engineer-About-Page.jpg",
    "Roderick Lucas-CEO-About-Page.jpg",
    "Rodrigo Lores-CCO-About-Page.jpg",
    "Rome Juilo-Quality Assurance-About-Page.jpg",
    "Senior attention is part of the delivery model-About-Page.jpg"
];

const assetsDir = path.join(__dirname, 'assets');

async function processImages() {
    for (const file of inputFiles) {
        const inputPath = path.join(assetsDir, file);
        const outputPath = path.join(assetsDir, file.replace('.jpg', '.webp'));

        if (fs.existsSync(inputPath)) {
            console.log(`Processing ${file}...`);
            try {
                // Resize to max 1920x1080 and set quality to reach ~70-90kb
                // Using a quality of 80 is a good starting point, we can adjust if needed
                await sharp(inputPath)
                    .resize({ width: 1200, withoutEnlargement: true }) // Reduce dimensions to help lower file size
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
