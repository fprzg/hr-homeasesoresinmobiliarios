import { schemas } from "@/db/schemas";
import { eq, SQL } from "drizzle-orm";
import { db } from "@/app"; // Asumiendo que tienes un archivo de configuración para la conexión a la BD
import {
    type InmuebleType,
    type CasaType,
    type TerrenoType,
    type AsentamientoType,
    type BloqueType
} from "@shared/zod";

import { nanoid } from "nanoid";

export async function leer(): Promise<InmuebleType[]> {
    const resultados = await db.select()
        .from(schemas.inmuebles)
        .leftJoin(schemas.casas, eq(schemas.inmuebles.id, schemas.casas.id))
        .leftJoin(schemas.terrenos, eq(schemas.inmuebles.id, schemas.terrenos.id))
        .leftJoin(schemas.asentamientos, eq(schemas.inmuebles.asentamientoId, schemas.asentamientos.id));

    return resultados.map(row => transformarRegistroAInmueble(row));
}

export async function leerPorId(id: string): Promise<InmuebleType | undefined> {
    const [resultados] = await db.select()
        .from(schemas.inmuebles)
        .leftJoin(schemas.casas, eq(schemas.inmuebles.id, schemas.casas.id))
        .leftJoin(schemas.terrenos, eq(schemas.inmuebles.id, schemas.terrenos.id))
        .leftJoin(schemas.asentamientos, eq(schemas.inmuebles.asentamientoId, schemas.asentamientos.id))
        .where(eq(schemas.inmuebles.id, id));

    if (!resultados) {
        return undefined;
    }

    return transformarRegistroAInmueble(resultados);
}

export async function guardar(data: InmuebleType): Promise<boolean> {
    try {
        data.id = `doc_${nanoid()}`;

        const [nuevoAsentamiento] = await db.insert(schemas.asentamientos)
            .values({
                tipo: data.asentamiento.tipo,
                calleColonia: data.asentamiento.calleColonia || null,
                municipio: data.asentamiento.municipio || null,
                codigoPostal: data.asentamiento.codigoPostal || null,
                estado: data.asentamiento.estado
            })
            .returning({ id: schemas.asentamientos.id });
        if (!nuevoAsentamiento) {
            throw new Error("no se pudo guardar el asentamiento.")
        }

        const asentamientoId = nuevoAsentamiento.id;

        await db.insert(schemas.inmuebles)
            .values({
                id: data.id,
                categoria: data.tipo,
                asentamientoId,
                precio: data.precio,
                areaTotal: data.areaTotal,
                fechaPublicacion: data.fechaPublicacion,
                fechaActualizacion: data.fechaActualizacion,
                portada: data.portada,
                contenido: data.contenido
            });

        if (data.tipo === "casa") {
            const casa = data as CasaType;
            await db.insert(schemas.casas)
                .values({
                    id: data.id,
                    areaConstruida: casa.areaConstruida,
                    numAreas: casa.totalAreas,
                    numBanos: casa.numBanos,
                    numRecamaras: casa.numRecamaras,
                    numPisos: casa.numPisos,
                    numCocheras: casa.numCocheras,
                    piscina: casa.piscina ? 1 : 0
                });
        } else if (data.tipo === "terreno") {
            const terreno = data as TerrenoType;
            await db.insert(schemas.terrenos)
                .values({
                    id: data.id,
                    metrosFrente: terreno.metrosFrente,
                    metrosFondo: terreno.metrosFondo,
                    tipoPropiedad: terreno.tipoPropiedad
                });
        }

        return true;
    } catch (error) {
        console.error("Error al guardar inmueble:", error);
        return false;
    }
}

export async function actualizar(data: InmuebleType): Promise<boolean> {
    try {
        const [inmuebleExistente] = await db.select()
            .from(schemas.inmuebles)
            .where(eq(schemas.inmuebles.id, data.id));

        if (!inmuebleExistente) {
            throw new Error(`no existe el inmueble con id ${data.id}`)
        }

        const [asentamientoActual] = await db.select()
            .from(schemas.asentamientos)
            .where(eq(schemas.asentamientos.id, inmuebleExistente.asentamientoId));

        if (!asentamientoActual) {
            throw new Error(`asentamiento con id ${inmuebleExistente.asentamientoId} no existe`);
        }

        let asentamientoId = asentamientoActual.id;

        if (asentamientoActual.tipo !== data.asentamiento.tipo ||
            asentamientoActual.estado !== data.asentamiento.estado ||
            asentamientoActual.calleColonia !== data.asentamiento.calleColonia ||
            asentamientoActual.municipio !== data.asentamiento.municipio ||
            asentamientoActual.codigoPostal !== data.asentamiento.codigoPostal
        ) {
            const [nuevoAsentamiento] = await db.update(schemas.asentamientos)
                .set({
                    tipo: data.asentamiento.tipo,
                    calleColonia: data.asentamiento.calleColonia || asentamientoActual.calleColonia,
                    municipio: data.asentamiento.municipio || asentamientoActual.municipio,
                    codigoPostal: data.asentamiento.codigoPostal || asentamientoActual.codigoPostal,
                    estado: data.asentamiento.estado
                })
                .where(eq(schemas.asentamientos.id, asentamientoActual.id))
                .returning({ id: schemas.asentamientos.id });

            if (!nuevoAsentamiento) {
                throw new Error("no se pudo actualizar el asentamiento");
            }

            asentamientoId = nuevoAsentamiento.id;
        } else {
            asentamientoId = asentamientoActual.id;
        }

        const [inmuebleUpdatedId] = await db.update(schemas.inmuebles)
            .set({
                categoria: data.tipo,
                asentamientoId,
                precio: data.precio,
                areaTotal: data.areaTotal,
                fechaActualizacion: data.fechaActualizacion,
                portada: data.portada,
                contenido: data.contenido
            })
            .where(eq(schemas.inmuebles.id, data.id))
            .returning({id: schemas.inmuebles.id});

            if(!inmuebleUpdatedId) {
                throw new Error(`no se pudo actualizar el inmueble de id ${data.id}`)
            }

        if (data.tipo === "casa") {
            const casa = data as CasaType;

            const [casaExistente] = await db.select()
                .from(schemas.casas)
                .where(eq(schemas.casas.id, data.id));

            if (casaExistente) {
                await db.update(schemas.casas)
                    .set({
                        areaConstruida: casa.areaConstruida,
                        numAreas: casa.totalAreas,
                        numBanos: casa.numBanos,
                        numRecamaras: casa.numRecamaras,
                        numPisos: casa.numPisos,
                        numCocheras: casa.numCocheras,
                        piscina: casa.piscina ? 1 : 0
                    })
                    .where(eq(schemas.casas.id, data.id));
            } else {
                await db.insert(schemas.casas)
                    .values({
                        id: data.id,
                        areaConstruida: casa.areaConstruida,
                        numAreas: casa.totalAreas,
                        numBanos: casa.numBanos,
                        numRecamaras: casa.numRecamaras,
                        numPisos: casa.numPisos,
                        numCocheras: casa.numCocheras,
                        piscina: casa.piscina ? 1 : 0
                    });

                await db.delete(schemas.terrenos)
                    .where(eq(schemas.terrenos.id, data.id));
            }
        } else if (data.tipo === "terreno") {
            const terreno = data as TerrenoType;

            const [terrenoExistente] = await db.select()
                .from(schemas.terrenos)
                .where(eq(schemas.terrenos.id, data.id));

            if (terrenoExistente) {
                await db.update(schemas.terrenos)
                    .set({
                        metrosFrente: terreno.metrosFrente,
                        metrosFondo: terreno.metrosFondo,
                        tipoPropiedad: terreno.tipoPropiedad
                    })
                    .where(eq(schemas.terrenos.id, data.id));
            } else {
                await db.insert(schemas.terrenos)
                    .values({
                        id: data.id,
                        metrosFrente: terreno.metrosFrente,
                        metrosFondo: terreno.metrosFondo,
                        tipoPropiedad: terreno.tipoPropiedad
                    });

                await db.delete(schemas.casas)
                    .where(eq(schemas.casas.id, data.id));
            }
        }

        return true;
    } catch (error) {
        console.error("Error al actualizar inmueble:", error);
        return false;
    }
}

export async function eliminar(id: string): Promise<boolean> {
    try {
        const [inmuebleExistente] = await db.select()
            .from(schemas.inmuebles)
            .where(eq(schemas.inmuebles.id, id));

        if (!inmuebleExistente) {
            return false;
        }

        if (inmuebleExistente.categoria === "casa") {
            await db.delete(schemas.casas)
                .where(eq(schemas.casas.id, id));
        } else if (inmuebleExistente.categoria === "terreno") {
            await db.delete(schemas.terrenos)
                .where(eq(schemas.terrenos.id, id));
        }

        await db.delete(schemas.inmuebles)
            .where(eq(schemas.inmuebles.id, id));

        return true;
    } catch (error) {
        console.error("Error al eliminar inmueble:", error);
        return false;
    }
}

function transformarRegistroAInmueble(row: any): InmuebleType {
    const asentamiento: AsentamientoType = {
        tipo: row.asentamientos.tipo || "",
        calleColonia: row.asentamientos.calleColonia || undefined,
        municipio: row.asentamientos.municipio || undefined,
        codigoPostal: row.asentamientos.codigoPostal || undefined,
        estado: row.asentamientos.estado || ""
    };

    const fechaPublicacion = row.inmuebles.fechaPublicacion || new Date().toISOString();
    const fechaActualizacion = row.inmuebles.fechaActualizacion || new Date().toISOString();

    const baseInmueble = {
        id: row.inmuebles.id || "",
        estado: row.inmuebles.estado || "",
        asentamiento,
        precio: row.inmuebles.precio || 0,
        areaTotal: row.inmuebles.areaTotal || 0,
        fechaPublicacion,
        fechaActualizacion,
        portada: row.inmuebles.portada || "",
        contenido: Array.isArray(row.inmuebles.contenido) ? row.inmuebles.contenido : []
    };

    if (row.inmuebles.categoria === "casa" && row.inmu_casas) {
        const casa: CasaType = {
            ...baseInmueble,
            tipo: "casa",
            areaConstruida: row.inmu_casas.areaConstruida || 0,
            numBanos: row.inmu_casas.numBanos || 0,
            numRecamaras: row.inmu_casas.numRecamaras || 0,
            numPisos: row.inmu_casas.numPisos || 0,
            numCocheras: row.inmu_casas.numCocheras || 0,
            totalAreas: row.inmu_casas.numAreas || 0, // Mapeando numAreas a totalAreas
            piscina: Boolean(row.inmu_casas.piscina)
        };
        return casa;
    } else if (row.inmuebles.categoria === "terreno" && row.inmu_terrenos) {
        const terreno: TerrenoType = {
            ...baseInmueble,
            tipo: "terreno",
            metrosFrente: row.inmu_terrenos.metrosFrente || 0,
            metrosFondo: row.inmu_terrenos.metrosFondo || 0,
            tipoPropiedad: (row.inmu_terrenos.tipoPropiedad as "privada" | "comunal" | "ejidal") || "privada"
        };
        return terreno;
    }

    throw new Error(`Tipo de inmueble no válido o datos inconsistentes para id: ${row.inmu_inmuebles.id}`);
}

export const InmueblesService = { leer, leerPorId, guardar, actualizar, eliminar };