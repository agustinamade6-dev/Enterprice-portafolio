"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/admin";
        router.push(callbackUrl);
        router.refresh(); // Refresh to update layout session state
      } else {
        const data = await res.json();
        setError(data.error || "Error de inicio de sesión");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4 text-paper">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Panel de Administración
          </h2>
          <p className="mt-2 text-sm text-paper/70">
            Inicia sesión para gestionar el contenido del portafolio.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email-address"
                className="mb-1 block text-sm font-medium text-paper/80"
              >
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm"
                placeholder="admin@enterprice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-paper/80"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl border border-transparent bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-ink p-4 text-paper"><div className="w-full max-w-md space-y-8 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl border border-white/10" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
