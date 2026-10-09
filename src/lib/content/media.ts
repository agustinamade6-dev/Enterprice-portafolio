import fs from "fs/promises";
import path from "path";

export interface MediaRepository {
  uploadImage(file: File): Promise<string>;
  listImages(): Promise<string[]>;
}

export class LocalMediaAdapter implements MediaRepository {
  async uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ""); // sanitize
    const filename = `${uniqueSuffix}-${originalName}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return relative URL
    return `/uploads/${filename}`;
  }

  async listImages(): Promise<string[]> {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      const files = await fs.readdir(uploadDir);
      return files.filter(f => f.match(/\.(png|jpe?g|gif|svg|webp)$/i)).map(f => `/uploads/${f}`);
    } catch (e) {
      return []; // Return empty if directory doesn't exist
    }
  }
}

export const mediaRepo: MediaRepository = new LocalMediaAdapter();
