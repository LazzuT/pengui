'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginWithPassword(formData: FormData) {
    const password = formData.get('password');

    if (!password || password !== process.env.MAINTENANCE_PASSWORD) {
        return { error: 'Hatalı şifre.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('pengui-access', 'true', {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
    });

    redirect('/');
}
