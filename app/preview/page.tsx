'use client';

import { useActionState } from 'react';
import { loginWithPassword } from './actions';
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

const initialState = {
    error: null as string | null,
};

export default function PreviewPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await loginWithPassword(formData);
        if (result && result.error) {
            return { error: result.error };
        }
        return { error: null };
    }, initialState);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
            <div className="w-full max-w-sm space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                <div className="text-center">
                    <div className="text-5xl mb-4">🐧</div>
                    <h1 className="text-2xl font-bold font-sans text-zinc-100 mb-2">Private Preview</h1>
                    <p className="text-zinc-500 text-sm font-sans mb-6">
                        Sisteme erişmek için şifrenizi girin.
                    </p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            required
                            className={`w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition-colors ${jetbrainsMono.className}`}
                        />
                    </div>

                    {state.error && (
                        <p className="text-red-400 text-sm font-sans px-1">
                            {state.error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded-xl px-4 py-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                    >
                        {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    );
}
