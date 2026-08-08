const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPNG(filename, width, height, colorFn) {
  const header = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const pixels = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const offset = y * (width * 4 + 1);
    pixels[offset] = 0;
    for (let x = 0; x < width; x++) {
      const px = colorFn(x, y, width, height);
      pixels[offset + 1 + 4 * x + 0] = px[0];
      pixels[offset + 1 + 4 * x + 1] = px[1];
      pixels[offset + 1 + 4 * x + 2] = px[2];
      pixels[offset + 1 + 4 * x + 3] = px[3];
    }
  }

  const idat = zlib.deflateSync(pixels);
  const png = Buffer.concat([
    header,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filename, png);
}

function radialCircle(x, y, width, height, innerColor, outerColor) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.35;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const t = Math.max(0, Math.min(1, (dist - r * 0.8) / (r * 0.2)));
  const inv = 1 - t;
  return [
    Math.round(innerColor[0] * inv + outerColor[0] * t),
    Math.round(innerColor[1] * inv + outerColor[1] * t),
    Math.round(innerColor[2] * inv + outerColor[2] * t),
    255,
  ];
}

createPNG('./favicons/light-logo.png', 64, 64, (x, y, w, h) => {
  const base = [240, 240, 255, 255];
  const circle = radialCircle(x, y, w, h, [52, 95, 255], [240, 240, 255]);
  if (circle[0] !== 240 || circle[1] !== 240 || circle[2] !== 255) {
    return circle;
  }
  return base;
});

createPNG('./favicons/dark-logo.png', 64, 64, (x, y, w, h) => {
  const base = [20, 28, 42, 255];
  const circle = radialCircle(x, y, w, h, [255, 215, 85], [20, 28, 42]);
  if (circle[0] !== 20 || circle[1] !== 28 || circle[2] !== 42) {
    return circle;
  }
  return base;
});

console.log('Created favicons/light-logo.png and favicons/dark-logo.png');
