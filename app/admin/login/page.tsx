import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-stone-100 px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">Sabor de Casa</p>
        <h1 className="mt-4 text-3xl font-bold text-stone-900">Entrar na administração</h1>
        <p className="mt-2 text-stone-500">Acesse a área administrativa com sua conta autorizada.</p>
        <LoginForm />
      </div>
    </main>
  );
}
