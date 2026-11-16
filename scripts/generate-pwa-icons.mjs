import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const colors = {
  background: [19, 34, 56],
  case: [245, 248, 255],
  dial: [36, 69, 103],
  marker: [206, 222, 240],
  accent: [255, 90, 95],
  center: [255, 204, 102],
};

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;

  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }

  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const contents = Buffer.concat([typeBuffer, data]);
  const chunk = Buffer.alloc(data.length + 12);

  chunk.writeUInt32BE(data.length, 0);
  contents.copy(chunk, 4);
  chunk.writeUInt32BE(crc32(contents), data.length + 8);

  return chunk;
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  const projection = Math.max(
    0,
    Math.min(1, ((x - x1) * deltaX + (y - y1) * deltaY) / lengthSquared),
  );
  const offsetX = x - (x1 + projection * deltaX);
  const offsetY = y - (y1 + projection * deltaY);

  return Math.hypot(offsetX, offsetY);
}

function colorAt(x, y) {
  const centerX = 0.5;
  const centerY = 0.59;
  const radius = Math.hypot(x - centerX, y - centerY);
  let color = colors.background;

  if (x >= 0.455 && x <= 0.545 && y >= 0.16 && y <= 0.3) {
    color = colors.case;
  }
  if (x >= 0.56 && x <= 0.675 && y >= 0.18 && y <= 0.225) {
    color = colors.case;
  }
  if (radius <= 0.345) color = colors.case;
  if (radius <= 0.29) color = colors.dial;

  if (radius > 0.215 && radius < 0.267 && y < centerY + 0.01) {
    for (let index = 0; index < 12; index += 1) {
      const angle = (index * Math.PI) / 6 - Math.PI / 2;
      const innerRadius = index % 3 === 0 ? 0.215 : 0.228;
      const outerRadius = index % 3 === 0 ? 0.267 : 0.255;
      const distance = distanceToSegment(
        x,
        y,
        centerX + Math.cos(angle) * innerRadius,
        centerY + Math.sin(angle) * innerRadius,
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius,
      );

      if (distance < (index % 3 === 0 ? 0.009 : 0.006)) {
        color = colors.marker;
        break;
      }
    }
  }

  if (
    radius <= 0.29 &&
    distanceToSegment(x, y, centerX, centerY, centerX, 0.375) < 0.012
  ) {
    color = colors.case;
  }
  if (
    radius <= 0.29 &&
    distanceToSegment(x, y, centerX, centerY, 0.655, 0.665) < 0.008
  ) {
    color = colors.accent;
  }
  if (radius < 0.027) color = colors.center;

  return color;
}

function createPng(size) {
  const samples = [0.25, 0.75];
  const rowLength = size * 4 + 1;
  const pixels = Buffer.alloc(rowLength * size);

  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * rowLength;
    pixels[rowOffset] = 0;

    for (let x = 0; x < size; x += 1) {
      const red = [0, 0, 0];

      for (const sampleY of samples) {
        for (const sampleX of samples) {
          const color = colorAt((x + sampleX) / size, (y + sampleY) / size);
          red[0] += color[0];
          red[1] += color[1];
          red[2] += color[2];
        }
      }

      const pixelOffset = rowOffset + 1 + x * 4;
      pixels[pixelOffset] = Math.round(red[0] / 4);
      pixels[pixelOffset + 1] = Math.round(red[1] / 4);
      pixels[pixelOffset + 2] = Math.round(red[2] / 4);
      pixels[pixelOffset + 3] = 255;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(pixels)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const [size, filename] of [
  [180, "apple-touch-icon.png"],
  [192, "pwa-icon-192.png"],
  [512, "pwa-icon-512.png"],
]) {
  await writeFile(join(process.cwd(), "public", filename), createPng(size));
}
