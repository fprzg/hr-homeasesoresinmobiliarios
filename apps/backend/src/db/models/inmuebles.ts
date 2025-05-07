import { type InmuebleType, type InmuebleBaseType, inmuebleBaseSchema } from "@shared/zod";

export function extraerInmuebleBase(data: InmuebleType): InmuebleBaseType {
    return {
        id: data.id,
        estado: data.estado,
        asentamiento: data.asentamiento,
        precio: data.precio,
        area_total: data.area_total,
        fechaPublicacion: data.fechaPublicacion,
        fechaActualizacion: data.fechaActualizacion,
        portada: data.portada,
        contenido: data.contenido,
    };
}

const buffer: InmuebleType[] = [];

function leer(): InmuebleType[] {
    return buffer;
}

function leerPorId(id: string): InmuebleType | undefined {
    const data = buffer.find(it => it.id === id)
    return data;
}

function guardar(data: InmuebleType): boolean {
    data.fechaPublicacion = data.fechaActualizacion = new Date().toString();
    buffer.push(data);
    return true;
}

function actualizar(data: InmuebleType): boolean {
    const idx = buffer.findIndex(it => it.id === data.id)
    if (!idx) {
        return false;
    }

    data.fechaActualizacion = new Date().toString();
    buffer[idx] = data;
    return true;
}

function eliminar(id: string): boolean {
    const idx = buffer.findIndex(it => it.id === id);
    if (!id) {
        return false;
    }
    buffer.splice(idx, 1)
    return true;
}

export const InmueblesService = { leer, leerPorId, guardar, actualizar, eliminar };