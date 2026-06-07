import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Monitor, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { register } from "@/services/api";

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [tipoConta, setTipoConta] = useState<"aluno" | "professor" | "tecnico">("aluno");
  const [lab, setLab] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const papel = tipoConta === "tecnico" ? "tecnico" : "usuario";
      const subtipo = tipoConta === "tecnico" ? undefined : tipoConta;
      const res = await register(nome, email, senha, papel, lab || undefined, subtipo);
      if (res.success) {
        navigate("/login", { state: { registeredEmail: email, message: "Conta criada com sucesso! Faça login." } });
      } else {
        setErro(res.error || "Erro ao criar conta.");
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
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Monitor className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">Criar Conta</h1>
            <p className="text-sm text-muted-foreground">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nome completo" value={nome} onChange={setNome} placeholder="Seu nome completo" required />
            <InputField label="Email institucional" type="email" value={email} onChange={setEmail} placeholder="seu.email@techlab.edu.br" required />
            <PasswordField label="Senha" value={senha} onChange={setSenha} placeholder="Mínimo 6 caracteres" required />
            <PasswordField label="Confirmar senha" value={confirmar} onChange={setConfirmar} placeholder="Repita a senha" required />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tipo de usuário</label>
              <select
                value={tipoConta}
                onChange={e => setTipoConta(e.target.value as "aluno" | "professor" | "tecnico")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="tecnico">Técnico</option>
              </select>
            </div>

            <InputField label="Laboratório (opcional)" value={lab} onChange={setLab} placeholder="Ex: Jobs" />

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>
          </form>

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

function InputField({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
