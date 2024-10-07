import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import ColorThief from 'colorthief';

const MAX_COLORS = 256;
const INPUT_FOLDER = '../images/v3';
const OUTPUT_FOLDER = '../images/v3-quantized';

interface RGB {
    r: number;
    g: number;
    b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function getClosestColor(color: RGB, palette: RGB[]): RGB {
    return palette.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.r - color.r) + Math.abs(prev.g - color.g) + Math.abs(prev.b - color.b);
        const currDiff = Math.abs(curr.r - color.r) + Math.abs(curr.g - color.g) + Math.abs(curr.b - color.b);
        return prevDiff < currDiff ? prev : curr;
    });
}

function createOutputFolder(folder: string) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
}

function getPngFiles(folder: string): string[] {
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    return entries.flatMap(entry => {
        const fullPath = path.join(folder, entry.name);
        if (entry.isDirectory()) {
            return getPngFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.png')) {
            return [fullPath];
        }
        return [];
    });
}

async function getAllColors(files: string[]): Promise<string[]> {
    let allColors: string[] = [];
    for (const file of files) {
        const colors = await (new ColorThief()).getPalette(file);
        allColors = allColors.concat(colors.map((color: number[]) => rgbToHex(color[0], color[1], color[2])));
    }
    return allColors;
}

function reduceColors(colors: string[]): RGB[] {
    const uniqueColors = [...new Set(colors)];
    return uniqueColors.slice(0, MAX_COLORS).map(hexToRgb);
}

function quantizeImage(inputPath: string, outputPath: string, reducedPalette: RGB[]) {
    const inputData = fs.readFileSync(inputPath);
    const png = PNG.sync.read(inputData);

    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (png.width * y + x) << 2;
            const originalColor = { r: png.data[idx], g: png.data[idx + 1], b: png.data[idx + 2] };
            const closestColor = getClosestColor(originalColor, reducedPalette);

            png.data[idx] = closestColor.r;
            png.data[idx + 1] = closestColor.g;
            png.data[idx + 2] = closestColor.b;
            // We keep the original alpha value
        }
    }

    const buffer = PNG.sync.write(png);
    fs.writeFileSync(outputPath, buffer);
}

async function quantizeImages() {
    createOutputFolder(OUTPUT_FOLDER);

    const files = getPngFiles(INPUT_FOLDER);
    const allColors = await getAllColors(files);
    const reducedPalette = reduceColors(allColors);

    for (const file of files) {
        const relativePath = path.relative(INPUT_FOLDER, file);
        const outputPath = path.join(OUTPUT_FOLDER, relativePath);
        createOutputFolder(path.dirname(outputPath));
        quantizeImage(file, outputPath, reducedPalette);
    }

    console.log(`Quantization complete. Processed ${files.length} images.`);
}

quantizeImages().catch(console.error);
