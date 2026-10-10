import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export interface MediaRepository {
  uploadImage(file: File): Promise<string>;
  listImages(): Promise<string[]>;
}

export class UploadError extends Error {}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// Solo imágenes de verdad. Se mira el contenido del archivo (sus primeros bytes), no el nombre:
// un .html o un .svg con código renombrado a .png no pasa. SVG no se acepta porque puede llevar código.
const SIGNATURES: { ext: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: "gif", test: (b) => b.subarray(0, 4).toString("ascii") === "GIF8" },
  { ext: "webp", test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
];

const uploadDir = () => path.join(process.cwd(), "public", "uploads");

export class LocalMediaAdapter implements MediaRepository {
  async uploadImage(file: File): Promise<string> {
    if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("La imagen pesa más de 5 MB");
    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = SIGNATURES.find((s) => s.test(buffer));
    if (!kind) throw new UploadError("Solo se aceptan imágenes JPG, PNG, WebP o GIF");

    // El nombre lo pone el servidor: fecha + parte del nombre original (solo letras y números) + extensión real
    const base = path.parse(file.name).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "imagen";
    const filename = `${Date.now()}-${randomBytes(4).toString("hex")}-${base}.${kind.ext}`;

    await fs.mkdir(uploadDir(), { recursive: true });
    await fs.writeFile(path.join(uploadDir(), filename), buffer, { flag: "wx" });
    return `/uploads/${filename}`;
  }

  async listImages(): Promise<string[]> {
    try {
      const files = await fs.readdir(uploadDir());
      return files.filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f)).map((f) => `/uploads/${f}`);
    } catch {
      return [];
    }
  }
}

export const mediaRepo: MediaRepository = new LocalMediaAdapter();
