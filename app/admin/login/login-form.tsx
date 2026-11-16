"use client";

import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-stone-700">
        E-mail
        <input
          required
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="block text-sm font-semibold text-stone-700">
        Senha
        <input
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button
        className="w-full rounded-xl bg-orange-600 px-5 py-4 font-bold text-white disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
