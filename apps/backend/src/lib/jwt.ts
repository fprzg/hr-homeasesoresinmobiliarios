import { SignJWT, jwtVerify } from 'jose';
import { jwtPayloadSchema, type JwtPayload } from '@/zod/jwt';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_secret');

export async function generateJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // 7 días

    return await new SignJWT({ ...payload, iat, exp })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, secret);
    return jwtPayloadSchema.parse(payload); // valida con Zod
}
