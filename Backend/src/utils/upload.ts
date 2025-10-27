import multer from "multer";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import type { Request } from "express";

// Directorios base
export const UPLOADS_DIR = path.resolve("uploads");
export const ASSETS_DIR = path.resolve("assets");

// Crear carpeta uploads si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("✅ Carpeta 'uploads/' creada automáticamente");
}

// Copiar imagen por defecto si no existe
const defaultImageSrc = path.join(ASSETS_DIR, "default.png");
const defaultImageDest = path.join(UPLOADS_DIR, "default.png");

if (fs.existsSync(defaultImageSrc) && !fs.existsSync(defaultImageDest)) {
  fs.copyFileSync(defaultImageSrc, defaultImageDest);
  console.log("✅ Imagen por defecto copiada en 'uploads/default.png'");
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (err: Error | null, destination: string) => void) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
    // obtener extensión segura
    const extFromOriginal = path.extname(file.originalname);
    const extFromMime = mime.extension(file.mimetype);
    const ext = extFromOriginal || (extFromMime ? `.${extFromMime}` : "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique); // ✅ siempre string
  },
});

// 🔸 Validación de tipos de archivos
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo no permitido. Solo imágenes (jpeg/png/webp)."));
};

// 🔸 Exportar instancia configurada
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máx 5MB
  fileFilter,
});