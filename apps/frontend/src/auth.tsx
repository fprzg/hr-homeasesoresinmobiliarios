import { parse } from 'cookie'
import { redirect } from '@tanstack/react-router'

async function requireAuth() {
    const cookies = parse(document.cookie)
    const token = cookies.token;

    if (!token) {
        throw redirect({ to: '/' });
    }

    const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw redirect({ to: '/' });
    }

    return true;
}