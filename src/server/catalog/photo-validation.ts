const MAX_SIZE = 1024 * 1024;
const MIN_DIMENSION = 600;
export const PHOTO_ERROR = "A fotografia deve ser JPEG, PNG ou WebP, ter até 1 MB e no mínimo 600 × 600 pixels.";

type ImageInfo = { mime: "image/jpeg" | "image/png" | "image/webp"; width: number; height: number };

function u32(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset);
}

function jpegDimensions(bytes: Uint8Array): [number, number] | null {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset++; continue; }
    const marker = bytes[offset + 1]; offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.length) return null;
    const length = (bytes[offset] << 8) | bytes[offset + 1];
    if (marker >= 0xc0 && marker <= 0xc3 || marker >= 0xc5 && marker <= 0xc7 || marker >= 0xc9 && marker <= 0xcb || marker >= 0xcd && marker <= 0xcf) {
      if (offset + 7 > bytes.length) return null;
      return [(bytes[offset + 5] << 8) | bytes[offset + 6], (bytes[offset + 3] << 8) | bytes[offset + 4]];
    }
    offset += length;
  }
  return null;
}

export function inspectImage(bytes: Uint8Array): ImageInfo | null {
  if (bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[12] === 0x49 && bytes[13] === 0x48 && bytes[14] === 0x44 && bytes[15] === 0x52) {
    return { mime: "image/png", width: u32(bytes, 16), height: u32(bytes, 20) };
  }
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") {
    const type = String.fromCharCode(...bytes.slice(12, 16));
    if (type === "VP8X" && bytes.length >= 30) return { mime: "image/webp", width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    if (type === "VP8 " && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) return { mime: "image/webp", width: (bytes[26] | bytes[27] << 8) & 0x3fff, height: (bytes[28] | bytes[29] << 8) & 0x3fff };
    return null;
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    const dimensions = jpegDimensions(bytes);
    return dimensions ? { mime: "image/jpeg", width: dimensions[0], height: dimensions[1] } : null;
  }
  return null;
}

export async function validatePhoto(file: File | null): Promise<Uint8Array> {
  if (!file || file.size === 0 || file.size > MAX_SIZE) throw new Error(PHOTO_ERROR);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const info = inspectImage(bytes);
  if (!info || info.width < MIN_DIMENSION || info.height < MIN_DIMENSION) throw new Error(PHOTO_ERROR);
  return bytes;
}
