import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Monitor, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { registeredEmail?: string; message?: string } | null;
  const [email, setEmail] = useState(state?.registeredEmail || "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(state?.message || "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.message) {
      const t = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(t);
    }
  }, [state?.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const ok = await login(email, senha);
      if (ok) {
        navigate("/");
      } else {
        setErro("Email ou senha inválidos.");
      }
    } catch {
      setErro("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="rounded-xl border bg-card p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Monitor className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">TechLab</h1>
            <p className="text-sm text-muted-foreground">Gestão de Chamados — Laboratórios</p>
          </div>

          {successMsg && (
            <p className="mb-4 rounded-md bg-green-100 dark:bg-green-900/30 p-2.5 text-sm text-green-700 dark:text-green-400 text-center animate-fade-in">
              {successMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@techlab.edu.br"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-sm text-destructive">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link to="/esqueci-senha" className="text-primary hover:underline">Esqueci minha senha</Link>
            <Link to="/cadastro" className="text-primary hover:underline">Criar conta</Link>
          </div>

          <div className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Contas de demonstração:</p>
            <p>Admin: <span className="font-mono">admin@techlab.com</span> / admin123</p>
            <p>Técnico: <span className="font-mono">tecnico@techlab.com</span> / tecnico123</p>
            <p>Usuário: <span className="font-mono">usuario@techlab.com</span> / usuario123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
