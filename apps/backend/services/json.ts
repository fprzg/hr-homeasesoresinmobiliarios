import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Definición del esquema para validación con Zod
const JsonFileSchema = z.object({
  id: z.string(),
  data: z.any(),
  lastModified: z.number(),
}).strict();

// Tipo inferido del esquema
type JsonFile = z.infer<typeof JsonFileSchema>;

// Error personalizado
class JsonFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonFileError';
  }
}

// Clase principal de la plataforma de abstracción
class JsonFilePlatform {
  private directory: string;
  private cache: Map<string, JsonFile>;

  constructor(directory: string) {
    this.directory = directory;
    this.cache = new Map();
  }

  // Inicializa el directorio si no existe
  private async ensureDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.directory, { recursive: true });
    } catch (error) {
      throw new JsonFileError(`Failed to create directory: ${this.directory}`);
    }
  }

  // Obtiene la ruta completa del archivo
  private getFilePath(id: string): string {
    return path.join(this.directory, `${id}.json`);
  }

  // Valida el contenido del archivo
  private validateFile(content: unknown): JsonFile {
    try {
      return JsonFileSchema.parse(content);
    } catch (error) {
      throw new JsonFileError(`Invalid JSON file format: ${error.message}`);
    }
  }

  // Carga un archivo desde el disco al caché
  private async loadToCache(id: string): Promise<JsonFile> {
    const filePath = this.getFilePath(id);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      const validated = this.validateFile(parsed);
      this.cache.set(id, validated);
      return validated;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new JsonFileError(`File not found: ${id}`);
      }
      throw new JsonFileError(`Failed to load file: ${id}`);
    }
  }

  // Método para guardar un archivo
  async save(id: string, data: any): Promise<void> {
    await this.ensureDirectory();
    
    const file: JsonFile = {
      id,
      data,
      lastModified: Date.now(),
    };

    const validated = this.validateFile(file);
    const filePath = this.getFilePath(id);

    try {
      await fs.writeFile(filePath, JSON.stringify(validated, null, 2));
      this.cache.set(id, validated);
    } catch (error) {
      throw new JsonFileError(`Failed to save file: ${id}`);
    }
  }

  // Método para abrir un archivo
  async open(id: string): Promise<JsonFile> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    return this.loadToCache(id);
  }

  // Método para actualizar un archivo
  async update(id: string, data: any): Promise<void> {
    if (!this.cache.has(id)) {
      await this.loadToCache(id);
    }

    const file: JsonFile = {
      id,
      data,
      lastModified: Date.now(),
    };

    const validated = this.validateFile(file);
    const filePath = this.getFilePath(id);

    try {
      await fs.writeFile(filePath, JSON.stringify(validated, null, 2));
      this.cache.set(id, validated);
    } catch (error) {
      throw new JsonFileError(`Failed to update file: ${id}`);
    }
  }

  // Método para eliminar un archivo
  async delete(id: string): Promise<void> {
    const filePath = this.getFilePath(id);
    try {
      await fs.unlink(filePath);
      this.cache.delete(id);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new JsonFileError(`File not found: ${id}`);
      }
      throw new JsonFileError(`Failed to delete file: ${id}`);
    }
  }

  // Método para listar todos los archivos
  async list(): Promise<string[]> {
    await this.ensureDirectory();
    try {
      const files = await fs.readdir(this.directory);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
    } catch (error) {
      throw new JsonFileError('Failed to list files');
    }
  }
}

// Ejemplo de uso
async function example() {
  const platform = new JsonFilePlatform('./data');

  try {
    // Guardar un nuevo archivo
    await platform.save('user1', { name: 'John', age: 30 });
    console.log('File saved');

    // Abrir el archivo
    const file = await platform.open('user1');
    console.log('File opened:', file);

    // Actualizar el archivo
    await platform.update('user1', { name: 'John', age: 31 });
    console.log('File updated');

    // Listar todos los archivos
    const files = await platform.list();
    console.log('All files:', files);

    // Eliminar el archivo
    await platform.delete('user1');
    console.log('File deleted');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Exportar la clase
export { JsonFilePlatform, JsonFileError };