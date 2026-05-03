import { useState } from "react";
import { Link } from "react-router-dom";
import { Monitor, ArrowLeft, Mail } from "lucide-react";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="rounded-xl border bg-card p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Monitor className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">Recuperar Senha</h1>
            <p className="text-sm text-muted-foreground text-center">
              Informe seu email institucional para receber o link de recuperação
            </p>
          </div>

          {!enviado ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.email@labtech.edu.br"
                  required
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Se o email <span className="font-medium text-foreground">{email}</span> estiver cadastrado, você receberá um link de recuperação.
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
